angular.module('AgoraModule').controller('AgoraCtrlProject', [ 'fileService', '$scope', '$location', function(files, $scope, $location) {

	// Initialize the scope defaults.
	$scope.took = -1;
	$scope.total = -1;
	$scope.hideResults = true;
	$scope.hideNoResults = true;
	$scope.hideMoreResults = true;
	$scope.files = []; // An array of the results to display.
	$scope.page = 0; // A counter to keep track of the current page.
	$scope.allResults = false; // Boolean denoting whether all results have been found.

	$scope.getTerm = $location.search().project || "";
	$scope.searchQuery = null;

	/**
	 * Implements the project retrieval. The scope variables are reset to their defaults, the q parameter is set, and
	 * the files of the project are loaded.
	 */
	$scope.search = function() {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		$scope.page = 0;
		$scope.files = [];
		$scope.allResults = false;
		if ($scope.getTerm) {
			$location.search({
				'project' : $scope.getTerm
			});
			$scope.loadMore();
		} else {
			$location.search({
				'project' : null
			});
			$scope.allResults = true;
			$scope.searchQuery = null;
			$scope.hideResults = true;
			$scope.hideNoResults = true;
		}
	};

	/**
	 * Loads the files of the project in variable $scope.files.
	 * 
	 * @param {boolean} loadall - determines whether all files should be loaded (true) or not (false).
	 */
	$scope.loadMore = function(loadall) {
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		if ($scope.getTerm) {
			$scope.searchQuery = {
				"bool" : {
					"should" : [ {
						"match" : {
							"project" : $scope.getTerm
						}
					}, {
						"match" : {
							"extension" : "java"
						}
					} ]
				}
			};
			files.getProjectFiles($scope.searchQuery, loadall, $scope.page++).then(function(results) {
				if ($scope.page == 1) {
					if (results.length > 0) {
						$scope.took = results[0].took / 1000;
						if ($scope.took < 0.001)
							$scope.took = 0.001;
						$scope.total = results[0].total;
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
