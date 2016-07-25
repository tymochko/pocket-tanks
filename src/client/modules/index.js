import 'angular';
import home from './home';
import game from './game';
import chat from './chat';
import login from './login';
import signup from './signup';
import profile from './profile';
import dashboard from './dashboard';
import navigation from './navigation';
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
    navigation.name
])
    .config(RouteConfig)
	.factory('socket', () => {
	    let socket = io.connect();

		socket.on('connect', () => {
			socket.emit('auth', {
				user: window.localStorage.user,
				username: window.localStorage.username
			});
		});

		socket.on('you-are-invited', (data) => {
            console.log(data, 'data');
			var result = confirm('Wanna play with ' + data.sender_username + '?');
			
            if (result) {
                console.log(gameService, 'gameService');
                console.log(gameService.getInitGameData, 'gameService.getInitGameData');
                gameService.getInitGameData();
            }
		});

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
