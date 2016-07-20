import angular from 'angular';
import ngRoute from 'angular-route';

module.exports = angular.module('tanks.login', [
    ngRoute
])

.service('sendLog',['$http', '$window',
    function($http, $window){

        this.log = (userInfo, $scope, $uibModalInstance, items, loginResult) => {
            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };
            return $http.post('/api/users/login', userInfo)
                    .then((response) => {
                        loginResult.result = true;
                        $uibModalInstance.close($scope.selected.item);
                        $window.location.reload();
                    },
                    (response) => {
                        loginResult.result = false;
                        console.log('failed to login');
                    });
        };
}])

.factory('loginResult', () => {
    return {
        result: false
    };
})

.controller('LoginCtrl', ['$scope', 'sendLog', '$uibModalInstance', 'items', 'loginResult',
function($scope, sendLog, $uibModalInstance, items, loginResult) {

        $scope.minLengthName = 5;
        $scope.maxLengthName = 15;

        $scope.minLengthPass = 6;
        $scope.maxLengthPass = 12;

        $scope.login = (user) => {

            var userInfo = {
                userName: user.name,
                userPassword: user.password
            };

            sendLog.log(userInfo, $scope, $uibModalInstance, items, loginResult);
            // alert(loginResult.result);
        }
    }
]);
