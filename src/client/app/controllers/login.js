app.controller('LoginSubmitController', ['$scope', 'sendLog', '$http', '$location', function($scope, sendLog, $http, $location) {

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
		$http.post('/users/login', userInfo)
		  .then(function(response) {
		  		console.log(userInfo.name);
		  		$location.path('/');
		      	logIn();
		      	$scope.loggedAs = userInfo.name;
		  }, function(response) {
		      console.log('failed');
		  });
	};

	// $http.post('/login')
	//   .then(function(response) {
	//       console.log('success');
	//   }, function(response) {
	//       console.log('failed');
	//   });

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