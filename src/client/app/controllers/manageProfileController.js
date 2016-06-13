app.controller('manageProfileController', ['$scope', '$uibModal', 'profileService', function ($scope, $uibModal, profileService) {
    $scope.emailStatus = true;
    $scope.user = {
        userName: "",
        userEmail: "",
        userPassword: "",
        userEmail:"",
        newPassword: "",
        confirmNewPassword: ""
    };

    let init = function () {
        //todo delete hardcode
        profileService.getProfileById("users/575af41962ba55dc0fe2dd33").then(function (resp) {
            $scope.user = resp.data;
        });
    };

    init();

    $scope.saveChanges = function (user) {

        if (user.newPassword === user.confirmNewPassword) {
            let userInfo = {
                userName: user.userName,
                userEmail: user.userEmail,
                userPassword: user.newPassword,
                _id:'575af41962ba55dc0fe2dd33'
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

    this.getProfileById = (id) => {//todo all changes to config
        return $http.get("http://localhost:3000/" + id);
    };
    this.deleteAccount = function () {
        //todo add delete router
        return $http.delete('http://localhost:3000/update', userInfo);


    }
    this.add = function (userInfo) {
        return $http.put('http://localhost:3000/users/update/575af41962ba55dc0fe2dd33', userInfo);
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
