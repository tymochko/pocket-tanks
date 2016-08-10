import angular from 'angular';
import ngRoute from 'angular-route';
import { gameService } from '../game/gameService';
import { game } from '../../models/gameModel';

module.exports = angular.module('tanks.dashboard', [
    ngRoute
])
.controller('DashboardCtrl', ['$scope', '$http', 'socket', '$q', '$uibModal', function($scope, $http, socket, $q, $uibModal) {
    let senderId;
    $http.get('api/users').then(function(response){
        var users = response.data.users;
        senderId = response.data.sessionId;

        users.forEach(function(value, index) {
            if (value._id == senderId) {
                delete users[index];
            }
        });
        $scope.users = users;
    });

    $scope.sendInvite = function(id){
        console.log('Invite sent');
        socket.emit('invite', { senderUser: senderId, targetUser: id });
    };

    socket.on('connect', () => {
        socket.emit('auth', {
            user: window.localStorage.user,
            username: window.localStorage.username
        });
    });

    socket.on('you-are-invited', function(data) {
        // const result = confirm('Wanna play with ' + data.sender_username + '?');
        // if (result === true) {
        //     socket.emit('accepted', {invitor: data.sender_user, invited: data.target_user});

        // } else {
        //     socket.emit('rejected', {invitor: data.sender_user});
        // }
        var modalInstance = $uibModal.open({
            templateUrl: 'dashboard/requestToPlay.html',
            controller: 'ConfirmCtrl',
            resolve: {
                data() {
                    return data;
                }
            }
        });
    });

    socket.on('start-game', function(foundGame) {
        localStorage.setItem('playerId', foundGame.playerId);
        window.location = `/game?id=${foundGame.gameId}`;
    });

    socket.on('invite-rejected', function(data) {
        alert('Your invitation was rejected.');
    });

    gameService().getUsersIds(socket, $q).then((usersIds) => {
        socket.emit('create-game', usersIds);
    });
}])
.controller('ConfirmCtrl', ['$scope', '$uibModalInstance', 'data', 'socket', function($scope, $uibModalInstance, data, socket) {
    $scope.data = data;

    $scope.ok = function() {
        $uibModalInstance.close();
        socket.emit('accepted', {invitor: data.senderUser, invited: data.targetUser});
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
        socket.emit('rejected', {invitor: data.senderUser});
    };
}])
.config(RouteConfig);


RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/dashboard', {
        controller: 'DashboardCtrl',
        templateUrl: 'dashboard/dashboard.html'
    });
}
