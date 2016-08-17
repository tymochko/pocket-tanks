import angular from 'angular';
import ngRoute from 'angular-route';
import { NavigationController } from './NavigationController';
import { NavigationConstructor } from './NavigationConstructorService';
import { RouteNavigation } from './RouteNavigationFactory';
import { navigation, navBarLogged, navBarNotLogged } from './NavigationDirectives';

module.exports = angular.module('tanks.navigation', [
    ngRoute
])
    .controller('NavigationController', NavigationController)
    .service('NavigationConstructor', NavigationConstructor)
    .factory('RouteNavigation', RouteNavigation)
    .directive('navigation', navigation)
    .directive('navBarLogged', navBarLogged)
    .directive('navBarNotLogged', navBarNotLogged);
