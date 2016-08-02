import { gameService } from './gameService';
import { transportData } from './GameCtrl';
import angular from 'angular';
import ngRoute from 'angular-route';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat'
])
    .controller('gameCtrl', ['socket', transportData])
    .config(RouteConfig)
    .factory('gameService', ['socket', '$q', gameService]);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: 'gameCtrl'
    });
}
