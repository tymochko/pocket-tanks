app.controller('LoginSubmitController', ['$scope', '$window', function($scope, $window) {

	$scope.register = function() {
		$scope.message = 'You logged successfully';
		$window.location.href = '/';
		logIn();
	}
}]);