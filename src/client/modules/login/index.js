var angular = require('angular');
var ngRoute = require('angular-route');
var $ = require('jquery');

module.exports = angular.module('tanks.login', [
    ngRoute
]).config(RouteConfig)
.controller(LoginCtrl);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/login', {
        controller: LoginCtrl,
        templateUrl: 'login/login.html'
    });
};

function LoginCtrl($scope, $http, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.login = function(user) {

        let userInfo = {
            userName: user.name,
            userPassword: user.password
        };

        $http.post('api/users/login', userInfo)
            .then(function(response) {
                    $('.hide-after-log').addClass('hidden');
                    $('.show-after-log').removeClass('hidden');
                    //Auth.setUser(user);
                    $uibModalInstance.close($scope.selected.item);
                },
                function(response) {
                    console.log('failed');
                }
            );
    }
    console.log("required dashboard!");
}


// app
//     .run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
//         $rootScope.$on('$routeChangeStart', function(event) {

//             if (!Auth.isLoggedIn()) {
//                 console.log('DENY');
//                 //event.preventDefault();
//                 $('.show-after-log').addClass('hidden');
//                 $('.hide-after-log').removeClass('hidden');
//             } else {
//                 console.log('ALLOW');
//             }
//         });
//     }])

//     .factory('Auth', function() {
//         var user;

//         return {
//             setUser: function(aUser) {
//                 user = aUser;
//             },
//             isLoggedIn: function() {
//                 return (user) ? user : false;
//             }
//         }
//     });