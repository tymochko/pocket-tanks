var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.game', [
    ngRoute
]).config(RouteConfig);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html'
    });
};