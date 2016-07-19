var angular = require('angular');
var ngRoute = require('angular-route');
var tankShot = require('../../models/tankShot');

module.exports = angular.module('tanks.game', [ngRoute, 'tanks.chat'])

.config(RouteConfig)



RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: gameCtrl
    });
};

function gameCtrl(){
    tankShot.initGame();
}
