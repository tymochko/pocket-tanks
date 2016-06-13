app.controller('mainCtrl', ['$scope','$uibModal', '$log', '$location', 
	function($scope, $uibModal, $log, $location) {

//<------------slider-------------> 
	$scope.myInterval = 2000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	$scope.noPause = true;
	var slides = $scope.slides = [];
	var currIndex = 0;

	$scope.addSlide = function(imageNum) {
		slides.push({
			image: 'public/images/home/' + imageNum +'.jpg',
			id: currIndex++
		});
	};

	for (var i = 0; i < 9; i++) {
		$scope.addSlide("0" + (i+1));
	}
//<-------------------------------->
	$scope.items = [];

	$scope.animationsEnabled = true;

	$scope.open = function () {
		var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'src/client/views/login.html',
				controller: 'LoginCtrl',
				resolve: {
					items: function () {
					  return $scope.items;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
	}
}]);

/////////////////////// for navbar (needs new file)
// function notLogged() {
//     $('.show-after-log').addClass('hidden');
//     $('.hide-after-log').removeClass('hidden');
// }

// function logIn() {
//     $('.hide-after-log').addClass('hidden');
//     $('.show-after-log').removeClass('hidden');
// }