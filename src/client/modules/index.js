require('angular');
var home = require('./home');
var login = require('./login');
var signup = require('./signup');
var profile = require('./profile');
var dashboard = require('./dashboard');
var game = require('./game');

module.exports = angular.module('tanks', [
    require('angular-route'),
    require('angular-animate'),
    require('ng-file-upload'),
    require('angular-ui-bootstrap'),
    require('angular-toastr'),
    require('angular-sanitize'),
    dashboard.name,
    game.name,
    home.name,
    login.name,
    signup.name,
    profile.name
]).config(RouteConfig)
.factory('socket', ['$rootScope', function($rootScope) {
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

RouteConfig.$inject = ['$routeProvider', '$locationProvider'];
function RouteConfig($routeProvider, $locationProvider) {
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}
