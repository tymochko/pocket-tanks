import angular from 'angular';
import ngRoute from 'angular-route';
import { equals } from './equalsDirective';
import { SignupCtrl } from './signupController';
import { sendReg } from './sendRegService';

module.exports = angular.module('tanks.signup',  [
    ngRoute
])
    .config(RouteConfig)
    .directive('equals', equals)
    .controller('SignupCtrl', SignupCtrl)
    .service('sendReg', sendReg)

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
	$routeProvider.when('/signup', {
    	controller: 'SignupCtrl',
    	templateUrl: 'signup/signup.html'
	});
};

