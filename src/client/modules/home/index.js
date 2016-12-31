import angular from 'angular';
import ngRoute from 'angular-route';
import { MainController } from './MainController';

module.exports = angular.module('tanks.home', [
    ngRoute
])
    .controller("MainController", MainController)
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'home/home.html',
            controller: MainController
        });
    })
