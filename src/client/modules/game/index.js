// import gameService from './DataTravel';
import { transportData } from './GameCtrl';
import angular from 'angular';
import ngRoute from 'angular-route';
import { initGame } from '../../models/tankShot';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat'
])
    // .controller('GameCtrl', GameCtrl)
    .controller('gameCtrl', ['gameService', transportData])
    .config(RouteConfig)
    .factory('gameService', ['$http', ($http) => {
        let gameData = {};

        // return {
        //     getGameData: (msg) => {
        //         gameData = msg;
        //         console.log(gameData, 'gameData');
        //     },
        //
        //     putGameData: (paramX) => {
        //         return initGame(paramX);
        //     }

        return function (msg) {
            gameData = msg;
            console.log(gameData, 'gameData');
            
            $http({
                method: 'GET',
                url: 'api/users/profile'
            }).then(function successCallback(response) {
                console.log(response.data, 'response.data');
                console.log('success');
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                console.log(response.data, 'response.data');
                console.log('error');
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
    }])
;

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: 'gameCtrl'
    })
}