app.controller('SignupCtrl', ['$scope', 'sendReg', function($scope, sendReg) {

	/*$scope.signup = function() {
		$scope.message = 'You registered successfully';
		$window.location.href = '/';
	};*/

	$scope.user = {
		name : "",
		age : "",
		email : "",
		password: ""
	};
	console.log($scope.user);


	$scope.register = function(user){
		console.log($scope.user);
		let userInfo = {
			userName : user.name,
			userAge : user.age,
			userEmail : user.email,
			userPassword : user.password
		};
		sendReg.add(userInfo);
	};

}]);

app.service('sendReg',['$http', function($http){
	this.add = function(userInfo){
		return $http.post('http://localhost:3000/users/add', userInfo).then(function(res){

		});
	};
}]);




	/*var directiveId = 'ngMatch';
app.directive(directiveId, ['$parse', function ($parse) {
 
var directive = {
link: link,
restrict: 'A',
require: '?ngModel'
};
return directive;
 
function link(scope, elem, attrs, ctrl) {
// if ngModel is not defined, we don't need to do anything
if (!ctrl) return;
if (!attrs[directiveId]) return;
 
var firstPassword = $parse(attrs[directiveId]);
 
var validator = function (value) {
var temp = firstPassword(scope),
v = value === temp;
ctrl.$setValidity('match', v);
return value;
}
 
ctrl.$parsers.unshift(validator);
ctrl.$formatters.push(validator);
attrs.$observe(directiveId, function () {
validator(ctrl.$viewValue);
});
 
}
}]);*/