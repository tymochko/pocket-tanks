require('angular');
var chat = require('./chat/index');
// var game = require('.controllers/game/game');
var home = require('./home/index');
var login = require('./login/index');
var signup = require('./signup/index');
var profile = require('./profile/index');
var dashboard = require('./dashboard/index');
// var navigation = require('.controllers/navigation/navigation');

module.exports = angular.module('tanks', [
    require('angular-route'),
    require('angular-animate'),
    require('angular-ui-bootstrap'),
    require('angular-toastr'),
    // require('angular-sanitize'),
    dashboard.name,
    chat.name,
    // game.name
    home.name,
    login.name,
    signup.name,
    profile.name
    // navigation.name
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
