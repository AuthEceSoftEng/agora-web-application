/**
 * The file controller oF AGORA.
 */
angular.module('AgoraModule').controller('AgoraCtrlFile', [ 'fileService', '$scope', '$location', function(files, $scope, $location) {
	$scope.files = [];
	$scope.getTerm = $location.search().file;

	/**
	 * Implements the file retrieval.
	 */
	$scope.getFile = function() {
		$scope.requestType = "file";
		if ($scope.getTerm && $scope.getTerm !== "") {
			$location.search({
				'file' : $scope.getTerm
			});
			$scope.loadMore();
		}
	};

	/**
	 * Loads the file in variable $scope.files.
	 */
	$scope.loadMore = function() {
		if ($scope.getTerm && $scope.getTerm !== "") {
			files.getFile($scope.getTerm).then(function(result) {
				$scope.files.push(result);
			});
		}
	};
} ]);