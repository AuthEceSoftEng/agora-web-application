/**
 * Create the module.
 */
window.AgoraModule = angular.module('AgoraModule', ['elasticsearch', 'hljs', 'ngSanitize', 'gd.ui.jsonexplorer']);

/**
 * Create a service to power calls to Elasticsearch. We only need to
 * use the _search endpoint.
 */
AgoraModule.factory('fileService',
		['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
			var client = elasticsearch({
				host: $location.host() + ":8080"
			});

			/**
			 * Given a term and an offset, load another round of 10 files.
			 *
			 * Returns a promise.
			 */
			var search = function(query, highlightfields, offset){
				var deferred = $q.defer();
				
				var highlight = {};
				highlight.fields = [];
				for (var int = 0; int < highlightfields.length; int++) {
					var hfieldkey = highlightfields[int];
					var hfield = {};
					hfield[hfieldkey] = {"number_of_fragments": 1, "pre_tags": ["<eshi>"], "post_tags": ["</eshi>"]};
					highlight.fields.push(hfield);
				}
				highlight.require_field_match = false;

				if (Object.keys(query) && Object.keys(query).length == 1 && Object.keys(query)[0] === "query")
					query = query["query"];
				client.search({
					"index": 'agora',
					"type": 'files',
					"body": {
						"size": 10,
						"from": (offset || 0) * 10,
						"query": query,
					    "highlight" : highlight
					    },
					//"gui": 'true',
				}).then(function(result) {
					var ii = 0, hits_in, hits_out = [], response = {};
					hits_in = (result.hits || {}).hits || [];
					response["stats"] = {"total": result.hits.total, "took": result.took};
					for(;ii < hits_in.length; ii++){
						if (hits_in[ii].highlight){
							hits_in[ii]._source.fragment = {};
							for (var hkey in hits_in[ii].highlight) {
								hits_in[ii]._source.fragment[hkey] = hits_in[ii].highlight[hkey][0];
							}
						}
						hits_out.push(hits_in[ii]._source);
					}
					response["results"] = hits_out;
					deferred.resolve(response);
				}, deferred.reject);

				return deferred.promise;
			};

			var projectSearch = function(query, offset){
				var deferred = $q.defer();
				client.search({
					"index": 'agora',
					"type": 'projects',
					"body": {
						"size": 10,
						"from": (offset || 0) * 10,
						"query": query,
					    },
					//"gui": 'true',
				}).then(function(result) {
					var ii = 0, hits_in, hits_out = [], response = {};
					hits_in = (result.hits || {}).hits || [];
					response["stats"] = {"total": result.hits.total, "took": result.took};
					for(;ii < hits_in.length; ii++){
						hits_out.push(hits_in[ii]._source);
					}
					response["results"] = hits_out;
					deferred.resolve(response);
				}, deferred.reject);
				return deferred.promise;
			};

			var apiSearch = function(query, offset){
				var deferred = $q.defer();
				if (Object.keys(query) && Object.keys(query).length == 1 && Object.keys(query)[0] === "query")
					query = query["query"];
				client.search({
					"index": 'agora',
					"type": (keyExistsInTree(query, "has_child") ? 'projects': 'files'),
					"body": {
						"size": 10,
						"from": (offset || 0) * 10,
						"query": query,
					    },
					//"gui": 'true',
				}).then(function(result) {
					deferred.resolve(result);
				}, deferred.reject);
				return deferred.promise;
			};
			
			var getProjectFiles = function(query, loadall, offset){
				var deferred = $q.defer();
				client.search({
					"index": 'agora',
					"type": 'files',
					"body": {
						"size": loadall ? 100000 : 10,
						"from": (offset || 0) * 10,
						"query": query,
						"_source": ['path', 'fullpathname', 'name', 'content']
					    },
					//"gui": 'true',
				}).then(function(result) {
					var ii = 0, hits_in, hits_out = [];
						hits_in = (result.hits || {}).hits || [];
						for(;ii < hits_in.length; ii++){
							hits_out.push(hits_in[ii]._source);
						}
					deferred.resolve(hits_out);
				}, deferred.reject);
				return deferred.promise;
			};

			var getFile = function(fileid){
				//var routeid = fileid.split('/').slice(0, 2).join('/');
				var deferred = $q.defer();
				client.search({"index": 'agora', "type": 'files', 
					"body": {
						"size": 1,
						"from": 0,
						"query": {"term": {"_id": fileid}},
						"_source": ['path', 'project', 'name', 'content']
					}
				}).then(function(result) {
					var hits_in = (result.hits || {}).hits || [];
					deferred.resolve(hits_in[0]._source);
				}, deferred.reject);
				return deferred.promise;
			};
			
			return {
				"search": search,
				"apiSearch": apiSearch,
				"projectSearch": projectSearch,
				"getFile": getFile,
				"getProjectFiles": getProjectFiles
			};
		}]
);

AgoraModule.controller('AgoraCtrl', ['fileService', '$scope', '$location', function(files, $scope, $location){
    document.getElementById("search").focus();
    $scope.searchTerm = $location.search().q || "";
	$scope.initsearch = function(){
		if ($scope.searchTerm){
			window.location.href="http://" + $location.host() + "/search/#!?q=" + $scope.searchTerm;
		}
	};
}]);
