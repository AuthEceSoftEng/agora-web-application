/**
 * The Search controller oF AGORA.
 */
angular.module('AgoraModule').controller('AgoraCtrlSearch', [ 'fileService', '$scope', '$location', function(files, $scope, $location) {
	document.getElementById("search").focus();

	// Initialize the scope defaults.
	$scope.took = -1;
	$scope.total = -1;
	$scope.hideResults = true;
	$scope.hideNoResults = true;
	$scope.hideMoreResults = true;
	$scope.files = []; // An array of the results to display.
	$scope.page = 0; // A counter to keep track of the current page.
	$scope.allResults = false; // Boolean denoting whether all results have been found.

	$scope.searchTerm = $location.search().q || "";
	$scope.searchQuery = null;

	/**
	 * Implements the search. The scope variables are reset to their defaults, the q parameter is set, and the results
	 * are loaded.
	 */
	$scope.search = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		$scope.page = 0;
		$scope.files = [];
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
			$scope.allResults = true;
			$scope.searchQuery = null;
			$scope.hideResults = true;
			$scope.hideNoResults = true;
		}
	};

	/**
	 * Loads the next page of results and increments the page counter. When the query is finished, the results are in
	 * $scope.files.
	 */
	$scope.loadMore = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		if ($scope.searchTerm) {
			function isValidRegExp(thestring) {
				// . ? + * | { } [ ] ( ) " \
				var isValid = false;
				if (thestring.contains('.') /* || thestring.contains('"') */|| thestring.contains('?') || thestring.contains('+') || thestring.contains('*') || thestring.contains('|') || thestring.contains('{') || thestring.contains('}') || thestring.contains('[') || thestring.contains(']') || thestring.contains('(') || thestring.contains(')') || thestring.contains('\\')) {
					try {
						new RegExp(thestring);
						isValid = true;
					} catch (e) {
						isValid = false;
					}
				}
				return isValid;
			}

			if (isValidRegExp($scope.searchTerm)) {
				$scope.searchTerm = $scope.searchTerm.toLowerCase();
				$scope.searchQuery = {
					"bool" : {
						"should" : [ {
							"regexp" : {
								"analyzedcontent" : $scope.searchTerm
							}
						} ]
					}
				};
			} else {
				$scope.searchQuery = {
					"bool" : {
						"should" : [ {
							"match" : {
								"_all" : $scope.searchTerm
							}
						}, {
							"match" : {
								"extension" : "java"
							}
						} ]
					}
				};
			}
			files.search($scope.searchQuery, [ "content" ], $scope.page++).then(function(response) {
				var stats = response.stats;
				var results = response.results;
				if ($scope.page == 1) {
					if (stats.total > 0) {
						$scope.took = stats.took / 1000;
						if ($scope.took < 0.001)
							$scope.took = 0.001;
						$scope.total = stats.total;
						$scope.hideResults = false;
					} else {
						$scope.took = -1;
						$scope.total = -1;
						$scope.hideResults = true;
					}
				}

				if (results.length !== 10) {
					$scope.allResults = true;
				}

				var ii = 0;
				for (; ii < results.length; ii++) {
					if (!$scope.searchTerm.containsWord("java")) {
						if (results[ii].fragment) {
							results[ii].fragment.content = results[ii].fragment.content.replaceAll("<eshi>java</eshi>", "java");
							results[ii].fragment.content = results[ii].fragment.content.replaceAll("<eshi>Java</eshi>", "Java");
							results[ii].fragment.content = results[ii].fragment.content.replaceAll("<eshi>JAVA</eshi>", "JAVA");
							if (!results[ii].fragment.content.contains("<eshi>"))
								results[ii].fragment.content = null;
						}
					}
					$scope.files.push(results[ii]);
				}
				if ($scope.files.length == 0) {
					$scope.hideNoResults = false;
					$scope.hideMoreResults = true;
					$scope.hideResults = true;
				} else {
					$scope.hideNoResults = true;
					$scope.hideResults = false;
					if ($scope.allResults)
						$scope.hideMoreResults = true;
					else
						$scope.hideMoreResults = false;
				}
			});

		} else {
			$scope.searchQuery = null;
			$scope.allResults = true;
			$scope.hideNoResults = true;
		}
	};
	$scope.loadMore();
} ]);