var app = angular.module("tanks", ['ngRoute','ngAnimate', 'ui.bootstrap','toastr','ngSanitize']);

app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'src/client/views/home.html',
            controller: 'mainCtrl'
        })
    
        .when('/dashboard', {
            templateUrl: 'src/client/views/dashboard.html',
            controller: 'DashboardCtrl'
        })

        .when('/signup', {
            templateUrl: 'src/client/views/signup.html',
            controller: 'SignupCtrl'
        })

        .when('/chat', {
            templateUrl: 'src/client/views/chat.html',
            controller: 'ChatController'
        })

        /*Login Form Route*/
        .when('/profile', {
            templateUrl: 'src/client/views/manageProfile.html',
            controller: 'manageProfileController'
        })

        .otherwise({
            redirectTo: '/404.html'
        });

    $locationProvider.html5Mode(true);
}]);

//////////// logOut Imitation | temporary function
function logOut() {
    location.reload();
}
