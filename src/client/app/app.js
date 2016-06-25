var app = angular.module("tanks", ['ngRoute','ngAnimate', 'ui.bootstrap','ngSanitize','angular-smilies']);
// var app = angular.module('scotch-chat', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'btford.socket-io']);

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
            controller: 'SliderCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'src/client/views/dashboard.html',
            controller: 'DashboardCtrl'
        })

        .when('/signup', {
            templateUrl: 'src/client/views/signup.html',
            controller: 'SignupCtrl'
        })

        /*Login Form Route*/
        .when('/login', {
            templateUrl: 'src/client/views/login.html',
            controller: 'LoginSubmitController'
        })
        .when('/profile', {
            templateUrl: 'src/client/views/manageProfile.html',
            controller: 'manageProfileController'
        })
        
        .when('/chat', {
            templateUrl: 'src/client/views/chat.html',
            controller: 'ChatController'
        })

        .otherwise({
            redirectTo: '/404.html'
        });

    $locationProvider.html5Mode(true);
}]);


//////////////////////// for navbar (needs new file)
function notLogged() {
    $('.show-after-log').addClass('hidden');
    $('.hide-after-log').removeClass('hidden');
}

function logIn() {
    $('.hide-after-log').addClass('hidden');
    $('.show-after-log').removeClass('hidden');
}