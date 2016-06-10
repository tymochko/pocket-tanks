app.controller('LoginSubmitController', ['$scope', 'sendLog', function($scope, sendLog) {

	$scope.user = {
		name : "",
		password: ""
	};


	$scope.register = function(user){
		console.log($scope.user);
		let userInfo = {
			userName : user.name,
			userPassword : user.password
		};
		sendLog.add(userInfo);
	};

}]);

app.service('sendLog',['$http', function($http){
	this.add = function(userInfo){
		return $http.post('http://localhost:3000/users/login', userInfo).then(function(res){

		});
	};
}]);


/*app.controller('LoginSubmitController', ['$scope', '$window', function($scope, $window) {

	$scope.register = function() {
		$scope.message = 'You logged successfully';
		$window.location.href = '/';
		logIn();
	}
}]);*/