var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.login', [
    ngRoute
])

.service('sendLog',['$http', '$window', 
    function($http, $window){
        
        this.log = function(userInfo, $scope, $uibModalInstance, items){
            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };
            return $http.post('/api/users/login', userInfo)
                    .then(function(response) {
                        $uibModalInstance.close($scope.selected.item);
                        $window.location.reload();
                    },
                    function(response) {
                        console.log('failed to login');
                    });
        };
}])

.controller('LoginCtrl', ['$scope', 'sendLog', '$uibModalInstance', 'items', 
 function ($scope, sendLog, $uibModalInstance, items) {
        
        $scope.login = function(user) {

            let userInfo = {
                userName: user.name,
                userPassword: user.password
            };

            sendLog.log(userInfo, $scope, $uibModalInstance, items);
        }
    }
]);