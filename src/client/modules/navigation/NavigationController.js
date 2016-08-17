import { NavigationConstructor } from './NavigationConstructorService';
import { toastr } from 'angular-toastr';

export class NavigationController {
    constructor($scope, $http, $window, $uibModal,NavigationConstructor,socket) {
        let activeGameId = NavigationConstructor.activeGameData();

        $scope.logged = false;
        $scope.item = {};
        $scope.resumeGame = () => {
            const thisPlayerId = localStorage.getItem('playerId');
            socket.emit("resume-game-id", {gameId: activeGameId, playerId: thisPlayerId});
        };

        $scope.logInClick = () => {
            const modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    item: () => {
                        return $scope.item;
                    }
                }
            });
            modalInstance.result.then((selectedItem) => {
                $scope.selected = selectedItem;
            });
        };

        $scope.logOutClick = () => {
            $http.post('/api/users/logout').then((response) => {
                if (response.data.status === 'success') {
                    $window.location.href = '/';
                }
                toastr.warning('Sorry! We have a problem \n with server.', 'Oops!', {
                    closeButton: true,
                    closeHtml: '<button>&times;</button>'
                });
            });
        };

        $scope.checkSessionFunc = () => {
            $http.get("/api/users/checkSession").then((res) => {
                if (res.data.status === 'success') {
                    $scope.logged = true;
                    return;
                }
                $scope.logged = false;
                window.localStorage.user = null;
                window.localStorage.username = null;
            }, () => {
                toastr.warning('Sorry! We have a problem \n with server.', 'Oops!', {
                    closeButton: true,
                    closeHtml: '<button>&times;</button>'
                });
            });
        };

        $scope.checkSessionFunc();
    }
}
