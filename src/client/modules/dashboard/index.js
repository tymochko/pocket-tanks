import angular from 'angular';
import ngRoute from 'angular-route';
import { gameService } from '../game/gameService';
import { game } from '../../models/gameModel';

module.exports = angular.module('tanks.dashboard', [
    ngRoute
])
.controller('DashboardCtrl', ['$scope', '$http', 'socket', '$q', function($scope, $http, socket, $q) {
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
        const result = confirm('Wanna play with ' + data.sender_username + '?');
        if (result === true) {
            socket.emit('accepted', {invitor: data.sender_user, invited: data.target_user});
            // window.location = "/game?id=" + gameId;

        } else {
            socket.emit('rejected', {invitor: data.sender_user});
        }
    });

    // socket.on('invite-accepted', function(data) {
    //     console.log('accepted');
    //     // alert('Your game is starting...');
    //     // window.location = `/api/users/game`;
    // });

    socket.on('game-created', function(foundGame) {
        console.log(foundGame, 'foundGame');
        // window.location = `/game?id=${foundGame._id}`;
    });

    socket.on('invite-rejected', function(data) {
        alert('Your invitation was rejected.');
    });

    gameService().getUsersIds(socket, $q).then((usersIds) => {
        console.log(usersIds, 'usersIds');
        socket.emit('start-game', usersIds);
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
