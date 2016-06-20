app.controller('SignupCtrl', ['$scope', 'sendReg', function($scope, sendReg) {
	$scope.maxname = 10;
	$scope.minname = 4;
	$scope.maxpassword = 12;
	$scope.minpassword = 3;
	$scope.maxage = 100;
	$scope.minage = 18;

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
			alert('Congratulations! You are successfully registered.\nYou can now log in');
		});
	};
}]);

		app.directive('notification', [ function () {
			return {
				controller: ['$scope', function ($scope) {
					$scope.notification = {
						status: 'hide',
						type: 'success',
						message: 'Welcome! It\'s yet another angular alert ;)'
					};
				}],
			 link: function(scope, elem, attrs) {
					attrs.$observe('notification', function (value) {
						if (value === 'show') {
							$(elem).show();
						}
					});
				}
			};
		}]);

/*app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.regForm.password.$viewValue;
                ctrl.$setValidity('noMatch', !noMatch);
            });
        }
    };
});
*/
