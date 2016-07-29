import angular from 'angular';
import ngRoute from 'angular-route';
import { gameService } from '../game/DataTravel';

module.exports = angular.module('tanks.dashboard', [
    ngRoute
])
.controller('DashboardCtrl', ['$scope', '$http', 'socket', 'gameService', function($scope, $http, socket, gameService) {
    $http.get('api/users').then(function(response){
        var users = response.data.users,
            id = response.data.sessionId;

        users.forEach(function(value, index) {
            if (value._id == id) {
                delete users[index];
            }
        });
        $scope.users = users;
    });

    $scope.sendInvite = function(id){
        console.log('Invite sent');
        socket.emit('invite', { target_user: id });
    };

    socket.on('connect', () => {
        socket.emit('auth', {
            user: window.localStorage.user,
            username: window.localStorage.username
        });
    });

    socket.on('you-are-invited', function(data) {
        var result = confirm('Wanna play with ' + data.sender_username + '?');
        if (result === true) {
            socket.emit('accepted', {invitor: data.sender_user, invited: data.target_user});
            window.location = "/game";

        } else {
            socket.emit('rejected', {invitor: data.sender_user});
        }
    });

    socket.on('invite-accepted', function(data) {
        gameService.getGameData(data);
        alert('Your game is starting...');
        window.location = "/game";
    });

    socket.on('invite-rejected', function(data) {
        alert('Your invitation was rejected.');
    });

}])
.config(RouteConfig);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/dashboard', {
        controller: 'DashboardCtrl',
        templateUrl: 'dashboard/dashboard.html'
    });
}