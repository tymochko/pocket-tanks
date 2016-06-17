app.controller('SignupCtrl', ['$scope', 'sendReg', function($scope, sendReg) {
	
	$scope.user = {
		name : "",
		age : "",
		email : "",
		password: ""
	};


	$scope.register = function(user){
		let userInfo = {
			userName : user.name,
			userAge : user.age,
			userEmail : user.email,
			userPassword : user.password
		};
		sendReg.add(userInfo);
	};

	

}]);

app.service('sendReg',['$http', '$location', function($http, $location){
	this.add = function(userInfo){
		return $http.post('http://localhost:3000/api/users/add', userInfo).then(function(res){
			$location.path('/');
			alert('Congratulations! You are successfully registered.\nNow You can log in');
		});
	};
}]);

app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.regForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});