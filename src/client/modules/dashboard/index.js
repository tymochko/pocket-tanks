import angular from 'angular';
import ngRoute from 'angular-route';
import { gameService } from '../game/gameService';
// import { game } from '../../models/gameModel';

module.exports = angular.module('tanks.dashboard', [
    ngRoute
])
.controller('DashboardCtrl', ['$scope', '$http', 'socket', '$q', '$uibModal', function($scope, $http, socket, $q, $uibModal) {
    let senderId;
    $http.get('api/users').then(function(response) {
        const users = response.data.users;
        senderId = response.data.sessionId;

        users.forEach(function(value, index) {
            if (value._id === senderId) {
                delete users[index];
            }
        });
        $scope.users = users;
    });

    $scope.sendInvite = (id) => {
        socket.emit('invite', { senderUser: senderId, targetUser: id });
    };

    socket.emit('auth', {
        user: window.localStorage.user,
        username: window.localStorage.username
    });

    socket.on('you-are-invited', function(data) {
        let modalInstance = $uibModal.open({
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
    //    socket.emit('points', {points:foundGame.originalPoints});
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
