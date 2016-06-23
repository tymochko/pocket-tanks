var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.game', [
    ngRoute
]).config(RouteConfig);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        controller: GameCtrl,
        templateUrl: 'controllers/game/game.html'
    });
};

function GameCtrl($scope, $location) {
    $location.url('http://localhost:3000/src/client/views/home.html');
    console.log("required dashboard!");
};