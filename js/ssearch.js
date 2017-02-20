angular.module('AgoraModule').controller('AgoraCtrlSnippet', ['fileService', '$scope', '$location', function(files, $scope, $location){
    document.getElementById("search").focus();

	// Initialize the scope defaults.
	$scope.took = -1;
	$scope.total = -1;
	$scope.hideResults = true;
	$scope.hideNoResults = true;
	$scope.hideMoreResults = true;
	$scope.files = [];        // An array of file results to display
	$scope.page = 0;            // A counter to keep track of our current page
	$scope.allResults = false;  // Whether or not all results have been found.

    $scope.searchTerm = $location.search().q || "";
    $scope.searchQuery = null;

	/**
	 * A fresh search. Reset the scope variables to their defaults, set
	 * the q query parameter, and load more results.
	 */
	$scope.search = function(){
		$scope.hideResults = true;
		$scope.hideNoResults = true;
		$scope.hideMoreResults = true;
		$scope.page = 0;
		$scope.files = [];
		$scope.allResults = false;
		if ($scope.searchTerm){
			$location.search({'q': $scope.searchTerm});
			$scope.loadMore();
		}
		else{
			$location.search({'q': null});
			$scope.allResults = true;
			$scope.searchQuery = null;
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
		if ($scope.searchTerm){
			$scope.searchQuery = {
					"bool":{"should":[
					                {"match": {
					                	"analyzedcontent": $scope.searchTerm
					                }}]
								}
							};
			files.search($scope.searchQuery, ["analyzedcontent"], $scope.page++).then(function(response){
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
					$scope.files.push(results[ii]);
				}
				if ($scope.files.length == 0){
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

		}else{
			$scope.searchQuery = null;
			$scope.allResults = true;
			$scope.hideNoResults = true;
		}
	};
	$scope.loadMore();
}]
);