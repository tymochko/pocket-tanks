app.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {

    $http.get('/users').then(function(response){
        $scope.users = response.data;
    });

    $scope.sendInvite = function(id){
        console.log(id);
    }

}]);