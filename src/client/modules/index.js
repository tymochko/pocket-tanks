import 'angular';
import home from './home';
import game from './game';
import chat from './chat';
import login from './login';
import signup from './signup';
import profile from './profile';
import dashboard from './dashboard';
import navigation from './navigation';

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

    socket.on('you-are-invited', function(data) {
        var result = confirm('Wanna play with ' + data.sender_username + '?');
        if (result == true) {
            socket.emit('accepted', {invitor: data.sender_user});
            window.location = "/game";
        } else {
            socket.emit('rejected', {invitor: data.sender_user});
        }
    });

    socket.on('invite-accepted', function(data) {
        alert('Your game is starting...');
        window.location = "/game";
    });
    socket.on('invite-rejected', function(data) {
        alert('Your invitation was rejected.');
    });

    return {
    	  on: (eventName, callback) => {
    		    socket.on(eventName, callback);
    	  },
    	  emit: (eventName, data) => {
    		    socket.emit(eventName, data);
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
