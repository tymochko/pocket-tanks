export class NavigationController {
    constructor($scope, $http, $window, $uibModal) {
        $scope.logged = false;
        $scope.item = {};

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
                    return $window.location.reload();
                }
                alert('server error');
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
                alert('server error');
            });
        };

        $scope.checkSessionFunc();
    }
}
