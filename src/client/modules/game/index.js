import angular from 'angular';
import ngRoute from 'angular-route';
import tankShot from '../../models/tankShot';
import externalVariables from '../../models/externalVariables';

module.exports = angular.module('tanks.game', [
    ngRoute,
    'tanks.chat'
])
.config(RouteConfig)

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'game/game.html',
        controller: gameCtrl
    });
};

function gameCtrl(){
	let canvasCont = externalVariables.initCanvas();
    tankShot.initGame(canvasCont.ctx, canvasCont.backCanvas, canvasCont.backCtx);
}
