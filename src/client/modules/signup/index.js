
import angular from 'angular';
import ngRoute from 'angular-route';
import {toastr} from 'angular-toastr';


module.exports = angular.module('tanks.signup',  [
    ngRoute
])
    .config(RouteConfig)
    .controller('testCtrl2', ['$scope', function ($scope) {


        $scope.set = function (a) {
            $scope.mass = a;
        }

    }])
    .controller('SignupCtrl', ['$scope', 'sendReg', 'toastr', function ($scope, sendReg, toastr) {

        $scope.maass = false;


        $scope.maxname = 15;
        $scope.minname = 5;
        $scope.maxpassword = 12;
        $scope.minpassword = 6;
        $scope.maxage = 100;
        $scope.minage = 18;

        $scope.user = {
            name: "",
            age: "",
            email: "",
            password: ""
        };

        $scope.register = function (user) {
            let userInfo = {
                userName: user.name,
                userAge: user.age,
                userEmail: user.email,
                userPassword: user.password
            };
            toastr.success('You registered successfully \n and can now log in.', 'Congratulations!', {
                closeButton: true,
                closeHtml: '<button>&times;</button>'
            })
            sendReg.add(userInfo);
            /*
            toastr.danger('Your username or e-mail address \n is taken. Please choose another one.', 'Oops!', {
                closeButton: true,
                closeHtml: '<button>&times;</button>'
            })
            */
        };
    }
    ])
    .directive('equals', function() {
      return {
        restrict: 'A', 
        require: '?ngModel', 
        link: function(scope, elem, attrs, ngModel) {
          if(!ngModel) return; 
          scope.$watch(attrs.ngModel, function() {
            validate();
          });
          attrs.$observe('equals', function (val) {
            validate();
          });
          var validate = function() {
            var val1 = ngModel.$viewValue;
            var val2 = attrs.equals;
            ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
          };
        }
      }
    })
    .service('sendReg', ['$http', '$location', function ($http, $location) {
        this.add = function (userInfo) {
            return $http.post('/api/users/add', userInfo).then(function (res) {
                $location.path('/');
            });
        };
    }]);


RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/signup', {
        controller: 'SignupCtrl',
        templateUrl: 'signup/signup.html'
    });
};

