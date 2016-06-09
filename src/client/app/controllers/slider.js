app.controller('SliderCtrl', ['$scope', function($scope) {

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
}]);

	