/**
 * The API Search controller oF AGORA.
 */
angular.module('AgoraModule').controller('AgoraCtrlApi', [ 'fileService', '$scope', '$location', function(files, $scope, $location) {
	document.getElementById("search").focus();

	// Initialize the scope defaults.
	$scope.hideError = true;
	$scope.hideQuery = true;
	$scope.hideResults = true;
	$scope.theresult = {}; // The result object to display.
	$scope.page = 0; // A counter to keep track of the current page.
	$scope.allResults = false; // Boolean denoting whether all results have been found.

	$scope.searchTerm = $location.search().q || "";
	$scope.searchQuery = null;
	$scope.stringError = null;

	$scope.apiLocation = $location.protocol() + "://" + $location.host() + ':8080';
	$scope.apiSampleQuery = "curl -XPOST " + $scope.apiLocation + "/_search -d 'query'";

	/**
	 * Implements an API search. The scope variables are reset to their defaults, the q parameter is set, and the
	 * results are loaded.
	 * 
	 * @param {string} anexample - string containing an id of an example (one of example1, example2, example3, example4)
	 *        or left undefined for another API search.
	 */
	$scope.search = function(anexample) {
		if (anexample === "example0")
			$scope.searchTerm = '{"query":{"bool":{"should":[{"match":{"_all":"filereader"}},{"match":{"extension": "java"}}]}}}';
		if (anexample === "example1")
			$scope.searchTerm = '{"query":{"bool":{"should":[{"match":{"code.class.name":"Stack"}},{"nested":{"path":"code.class.methods","query":{"bool":{"should":[{"match":{"code.class.methods.name":"push"}},{"term":{"code.class.methods.returntype":"void"}}]}}}},{"nested":{"path":"code.class.methods","query":{"bool":{"should":[{"match":{"code.class.methods.name":"pop"}},{"term":{"code.class.methods.returntype":"int"}}]}}}}]}}}';
		if (anexample === "example2")
			$scope.searchTerm = '{"query":{"bool":{"should":[{"match":{"files.code.class.name":"Export"}},{"match":{"files.code.class.extends":"WizardPage"}},{"match":{"files.code.imports":"eclipse"}}]}}}';
		if (anexample === "example3")
			$scope.searchTerm = '{"query":{"bool":{"should":[{"has_child":{"type":"files","query":{"match":{"code.class.implements":"Model"}}}},{"has_child":{"type":"files","query":{"match":{"code.class.implements":"View"}}}},{"has_child":{"type":"files","query":{"match":{"code.class.implements":"Controller"}}}},{"has_child":{"type":"files","query":{"match":{"code.class.extends":"JFrame"}}}}]}}}';
		if (anexample === "example4")
			$scope.searchTerm = '{"query":{"match":{"analyzedcontent":"File myfile = new File(\\"myfile.xml\\");\\nDocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();\\nDocumentBuilder dBuilder = dbFactory.newDocumentBuilder();\\nDocument doc = dBuilder.parse(myfile);"}}}';
		$scope.hideError = true;
		$scope.hideQuery = true;
		$scope.hideResults = true;
		$scope.page = 0;
		$scope.theresult = null;
		$scope.allResults = false;
		if ($scope.searchTerm) {
			$location.search({
				'q' : $scope.searchTerm
			});
			$scope.loadMore();
		} else {
			$location.search({
				'q' : null
			});
			$scope.hideError = true;
			$scope.hideQuery = true;
			$scope.hideResults = true;
			$scope.searchQuery = null;
		}
	};

	/**
	 * Highlights and presents a json string.
	 * 
	 * @param {string} json - the string to be highlighted.
	 * @return {string} the highlighted string.
	 */
	function syntaxHighlight(json) {
		if (typeof json != 'string') {
			json = JSON.stringify(json, undefined, 2);
		}
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			// UNCOMMENT THIS LINE TO USE BUILT-IN JSON VIEWER (WITHOUT COLLAPSIBLE NODES)
			// return '<eshi ' + cls + '>' + match + '</eshi>';
			return match;
		});
	}

	/**
	 * Loads the next page of results and increments the page counter. When the query is finished, the result is in
	 * $scope.theresult.
	 */
	$scope.loadMore = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		if ($scope.searchTerm) {
			try {
				$scope.searchQuery = JSON.parse($scope.searchTerm);
				$scope.hideError = true;
				$scope.hideQuery = false;

				$scope.stringSearchQuery = syntaxHighlight($scope.searchQuery);
				$scope.curlQuery = 'curl -XPOST ' + $scope.apiLocation + '/_search -d \'' + JSON.stringify($scope.searchQuery) + '\'';
				// $scope.curlQuery = $scope.curlQuery.replaceAll('\n', '');

				files.apiSearch($scope.searchQuery, $scope.page++).then(function(result) {
					$scope.theresult = syntaxHighlight(result);
					$scope.hideResults = false;
				});

			} catch (error) {
				$scope.stringSearchQuery = '{"match_all":""}';
				$scope.curlQuery = 'curl -XPOST ' + $scope.apiLocation + '/_search -d \'' + $scope.stringSearchQuery + '\'';
				// $scope.curlQuery = $scope.curlQuery.replaceAll('\n', '');
				$scope.hideError = false;
				$scope.hideQuery = true;
				$scope.hideResults = true;
				$scope.stringError = error.toString().replace("JSON.parse: ", "");
			}

		} else {
			$scope.searchQuery = null;
			$scope.hideError = true;
			$scope.hideQuery = true;
			$scope.hideResults = true;
		}
	};
	$scope.loadMore();
} ]);
