app.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {

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
        console.log(id);
    }

}]);