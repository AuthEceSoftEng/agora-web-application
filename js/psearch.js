angular.module('AgoraModule').controller('AgoraCtrlPSearch', ['fileService', '$scope', '$location', function(files, $scope, $location){
    //document.getElementById("cinputfirst").focus();

    $scope.searchQuery = null;

	// Initialize the scope defaults.
	$scope.took = -1;
	$scope.total = -1;
	$scope.hideResults = true;
	$scope.hideNoResults = true;
	$scope.hideMoreResults = true;
	$scope.projects = [];        // An array of file results to display
	$scope.page = 0;            // A counter to keep track of our current page
	$scope.allResults = false;  // Whether or not all results have been found.

	try{
		$scope.tclasses = JSON.parse($location.search().q) || [{'id':'class1'}];
	}catch(e){
		$scope.tclasses = [{'id':'class1'}];
	}
	
	$scope.addNewClass = function() {
		var newItemNo = $scope.tclasses.length+1;
		$scope.tclasses.push({'id':'class'+newItemNo});
	};
	$scope.showAddClass = function(tclass) {
		return tclass.id === $scope.tclasses[$scope.tclasses.length-1].id;
	};
	$scope.removeClass = function() {
		$scope.tclasses.pop();
	};
	$scope.showRemoveClass = function(tclass) {
		return tclass.id === $scope.tclasses[$scope.tclasses.length-1].id && $scope.tclasses.length > 1;
	};

	$scope.createquery = function(){
		$scope.searchQuery = {};
		$scope.searchQuery.bool = {};
		$scope.searchQuery.bool.should = [];
		shouldquery = $scope.searchQuery.bool.should;


		for (var i=0; i<$scope.tclasses.length; i++){
			var tclass = $scope.tclasses[i];
			shouldquery.push({"has_child": {"type": "files"}});
			shouldquery[shouldquery.length-1].has_child.query = {};
			shouldquery[shouldquery.length-1].has_child.query.bool = {};
			shouldquery[shouldquery.length-1].has_child.query.bool.should = [];
			tclshouldquery = shouldquery[shouldquery.length-1].has_child.query.bool.should;
			if (tclass.name)
				tclshouldquery.push({"match": {"code.class.name": tclass.name}});
			if (tclass.interface)
				tclshouldquery.push({"match": {"code.class.type": "interface"}});
			if (tclass.extends)
				tclshouldquery.push({"match": {"code.class.extends": tclass.extends}});
			if (tclass.implements)
				tclshouldquery.push({"match": {"code.class.implements": tclass.implements}});
			if (tclass.imports)
				tclshouldquery.push({"match": {"code.imports": tclass.imports}});
			if (tclass.package)
				tclshouldquery.push({"match": {"code.package": tclass.package}});
			if (tclshouldquery.length == 0)
				shouldquery.pop();
		}
		if ($scope.searchQuery.bool.should.length == 0){
			$scope.searchQuery = null;
		}
	};
	
	/**
	 * A fresh search. Reset the scope variables to their defaults, set
	 * the q query parameter, and load more results.
	 */
	$scope.search = function(){
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		$scope.page = 0;
		$scope.projects = [];
		$scope.allResults = false;
		if ($scope.tclasses){
			$location.search({'q': JSON.stringify($scope.tclasses)});
			$scope.loadMore();
		}
		else{
			$scope.allResults = true;
			$scope.allResults = true;
			$scope.hideResults = true;
			$scope.hideNoResults = true;
		}
	};

	/**
	 * Load the next page of results, incrementing the page counter.
	 * When query is finished, push results onto $scope.files and decide
	 * whether all results have been returned (i.e. were 10 results returned?)
	 */
	$scope.loadMore = function(){
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;

		if ($scope.tclasses){
			$scope.createquery();
			if ($scope.searchQuery){
				files.projectSearch($scope.searchQuery, $scope.page++).then(function(response){
					var stats = response.stats;
					var results = response.results;
					if ($scope.page == 1){
						if (stats.total > 0){
							$scope.took = stats.took / 1000;
							if ($scope.took < 0.001)
								$scope.took = 0.001;
							$scope.total = stats.total;
							$scope.hideResults = false;
						}
						else{
							$scope.took = -1;
							$scope.total = -1;
							$scope.hideResults = true;
						}
					}

					if(results.length !== 10){
						$scope.allResults = true;
					}

					var ii = 0;
					for(;ii < results.length; ii++){
						$scope.projects.push(results[ii]);
					}
					if ($scope.projects.length == 0){
						$scope.hideNoResults = false;
						$scope.hideMoreResults = true;
						$scope.hideResults = true;
					}
					else{
						$scope.hideNoResults = true;
						$scope.hideResults = false;
						if ($scope.allResults)
							$scope.hideMoreResults = true;
						else
							$scope.hideMoreResults = false;
					}
				});
			}
			else{
				$scope.searchQuery = null;
				$scope.allResults = true;
				$scope.hideNoResults = true;
			}
		}
	};
	$scope.loadMore();

}]
);