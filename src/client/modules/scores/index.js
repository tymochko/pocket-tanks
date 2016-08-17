import angular from 'angular';
import ngRoute from 'angular-route';
import { Scores } from './Scores';

module.exports = angular.module('tanks.scores',  [
    ngRoute
])
	.controller('Scores', Scores)
	.config( function ($routeProvider) {
	   $routeProvider
	   .when('/scores', {
	   	templateUrl: 'scores/scores.html',
		controller: Scores
    	
	});
});
