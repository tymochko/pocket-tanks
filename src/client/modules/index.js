import 'angular';
import home from './home';
import game from './game';
import chat from './chat';
import login from './login';
import signup from './signup';
import profile from './profile';
import dashboard from './dashboard';
import navigation from './navigation';
import scores from './scores';
import { gameService } from './game/DataTravel';

module.exports = angular.module('tanks', [
    require('angular-route'),
    require('angular-animate'),
    require('ng-file-upload'),
    require('angular-ui-bootstrap'),
    require('angular-toastr'),
    require('angular-sanitize'),
    dashboard.name,
    game.name,
    chat.name,
    home.name,
    login.name,
    signup.name,
    profile.name,
    navigation.name,
    scores.name
])

.config(RouteConfig)
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
