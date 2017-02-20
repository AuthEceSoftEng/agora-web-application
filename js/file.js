angular.module('AgoraModule').controller('AgoraCtrlFile', ['fileService', '$scope', '$location', function(files, $scope, $location){
	$scope.files = [];
	$scope.getTerm = $location.search().file;

	$scope.getFile = function(){
		$scope.requestType = "file";
		if($scope.getTerm && $scope.getTerm !== ""){
			$location.search({'file': $scope.getTerm});
			$scope.loadMore();
		}
	};

	$scope.loadMore = function(){
		if ($scope.getTerm && $scope.getTerm !== ""){
			files.getFile($scope.getTerm).then(function(result){
				$scope.files.push(result);
			});
		}
	};
}]
);