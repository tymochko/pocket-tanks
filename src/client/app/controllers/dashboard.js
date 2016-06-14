app.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {

    $http.get('/users').then(function(response){
        var users = response.data.users,
            id = response.data.myId;

        users.forEach(function(value, index) {
            if (value._id == id) {
                delete users[index];
            }
        })
        console.log(users);
        $scope.users = users;
    });

    $scope.sendInvite = function(id){
        console.log(id);
    }

}]);