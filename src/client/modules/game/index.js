import { gameService } from './DataTravel';
import { transportData } from './GameCtrl';
import angular from 'angular';
import ngRoute from 'angular-route';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat'
])
    .controller('gameCtrl', ['gameService', 'socket', transportData])
    .config(RouteConfig)
    .factory('gameService', ['socket', gameService]);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: 'gameCtrl'
    })
}