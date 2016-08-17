import { gameService } from './gameService';
import { transportData } from './GameCtrl';
import { gameFinishedCtrl } from './gameFinishedCtrl';
import angular from 'angular';
import ngRoute from 'angular-route';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat',
    'ui.bootstrap'
])
    .controller('gameCtrl', ['socket', '$q', '$uibModal', transportData])
    .controller('gameFinishedCtrl', ['$scope', '$uibModalInstance', 'win', gameFinishedCtrl])
    .config(RouteConfig)
    .factory('gameService', ['socket', '$q', '$uibModal', gameService]);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: 'gameCtrl'
    });
}
