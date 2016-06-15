app.controller('manageProfileController', ['$scope', '$uibModal', 'profileService', '$http', function ($scope, $uibModal, profileService, $http) {
    $scope.emailStatus = true;
    $scope.user = {
        userName: "",
        userEmail: "",
        userPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    };

    let init = function () {
        //todo delete hardcode
        profileService.getProfileById($scope.userId).then(function (resp) {
            $scope.user = resp.data;
        });
    };

    init();

    $scope.saveChanges = function (user) {

        if (user.newPassword === user.confirmNewPassword) {
            let userInfo = {
                _id: $scope.userId,
                userName: user.userName,
                userEmail: user.userEmail,
                userPassword: user.newPassword
            };
            profileService.add(userInfo);


        } else {
            console.log('ERROR')
        }

    };

    $scope.animationsEnabled = true;

    $scope.open = function () {

        let modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './src/client/views/views/myModalContent.html',
            controller: 'ModalInstanceCtrl'


        });
        modalInstance.result.then(function () {
            profileService.deleteAccount();
        })

    };

    $scope.toggleAnimation = () => {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}]);

app.service('profileService', ['$http',function ($http) {
    this.update = function (userInfo) {
        //todo all changes to config
        $http.post('http://localhost:3000/test', userInfo)
            .then(function (res) {

            });
    };
    var userId = '';

    this.getProfileById = (id) => {//todo all changes to config
        return $http.get("http://localhost:3000/api/users/profile/", id);
    };
    
    this.deleteAccount = function () {
        //todo add delete router
        return $http.delete('http://localhost:3000/update', userInfo);

    };
    
    this.add = function (userInfo) {
        $http.put('http://localhost:3000/api/users/update/', userInfo).then(function(response) {
            console.log('ok');
        });
    }
}]);

app.controller('ModalInstanceCtrl', ['$scope',function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
