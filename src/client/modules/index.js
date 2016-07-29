import 'angular';
import home from './home';
import game from './game';
import chat from './chat';
import login from './login';
import signup from './signup';
import profile from './profile';
import dashboard from './dashboard';
import navigation from './navigation';
import {eng} from '../languages/languages';
import {ukr} from '../languages/languages';

module.exports = angular.module('tanks', [
    require('angular-route'),
    require('angular-animate'),
    require('ng-file-upload'),
    require('angular-ui-bootstrap'),
    require('angular-toastr'),
    require('angular-sanitize'),
    require('angular-translate'),
    dashboard.name,
    game.name,
    chat.name,
    home.name,
    login.name,
    signup.name,
    profile.name,
    navigation.name
])

.config(RouteConfig)
    .config(function ($translateProvider) {
        $translateProvider.registerAvailableLanguageKeys(['eng','ukr'],{
            'en_*':'eng',
            'ukr_*':'ukr'
        });

        $translateProvider.translations('eng',eng);
        $translateProvider.translations('ukr',ukr);
        $translateProvider.useSanitizeValueStrategy('escape');


    })
.factory('socket', () => {
    let socket = io.connect();

    return {
    	  on: (eventName, callback) => {
    		    socket.on(eventName, callback);
    	  },
    	  emit: (eventName, data) => {
    		    socket.emit(eventName, data);
    	  },
        once: (eventName, data) => {
          socket.once(eventName, data);
        }
    };
});

RouteConfig.$inject = ['$routeProvider', '$locationProvider'];
function RouteConfig($routeProvider, $locationProvider) {
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}
