import { gameService } from './gameService';
import { transportData } from './GameCtrl';
import { confirmCtrl } from './confirmCtrl';
import { gameFinishedCtrl } from './gameFinishedCtrl';
import angular from 'angular';
import ngRoute from 'angular-route';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat',
    'ui.bootstrap',
    "pascalprecht.translate"
])
    .controller('gameCtrl', ['socket', '$q', '$uibModal','$translate', transportData])
    .controller('confirmCtrl', ['$scope', '$uibModalInstance', 'gameInst', 'socket','$translate', confirmCtrl])
    .controller('gameFinishedCtrl', ['$scope', '$uibModalInstance', 'win','$translate', gameFinishedCtrl])
    .config(RouteConfig)
    .factory('gameService', ['socket', '$q', '$uibModal','$translate', gameService]);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: 'gameCtrl'
    });
}
