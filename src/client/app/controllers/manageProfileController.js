app.controller('manageProfileController', ['$scope', '$uibModal', 'profileService', '$http' ,'toastr', function ($scope, $uibModal, profileService, $http, toastr) {
    $scope.emailStatus = true;


    $scope.nameMinLength = 5;
    $scope.nameMaxLength = 15;
    $scope.passMinLength = 6;
    $scope.passMaxLength = 12;
    $scope.user = {
        userName: "",
        userEmail: "",
        userPassword: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    };

      function savingMsg($scope) {
             toastr.success('Your changes are saved!', 'Message',{
          closeButton: true,
              closeHtml: '<button>&times;</button>'
      })};



    let init = function () {
        profileService.getProfileById($scope.userId).then(function (resp) {
            $scope.user = resp.data;
        });
    };
    init();
    $scope.saveChanges = function (user) {
        savingMsg();
        if (user.oldPassword) {
            profileService.checkPassword(user).then(function (resss) {
                if (resss) {
                    if (user.newPassword === user.confirmNewPassword) {
                        let userInfo = {
                            _id: $scope.userId,
                            userName: user.userName,
                            userAge: user.userAge,
                            userEmail: user.userEmail,
                            userPassword: user.newPassword
                        };

                        profileService.update(userInfo);
                    }
                }
            })
        }
        else {

            let userInfo = {
                _id: $scope.userId,
                userName: user.userName,
                userAge: user.userAge,
                userEmail: user.userEmail
            };
            profileService.update(userInfo);
        }

    };
    $scope.animationsEnabled = true;
// Delete popup controller;
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

app.service('profileService', ['$http', function ($http) {
    var userId = '';

    this.getProfileById = (id) => {//todo all changes to config
        return $http.get("http://localhost:3000/api/users/profile/", id);
    };

    this.checkPassword = function (user) {
        return $http.post('http://localhost:3000/users/testing', {
            userPassword: user.oldPassword,
            userName: user.userName
        });
    };

    this.deleteAccount = () => {
        return $http.put('http://localhost:3000/api/users/profile/delete/', {id: userId});
    };

    this.update = function (userInfo) {
        $http.put('http://localhost:3000/api/users/profile/update/', userInfo).then(function (response) {
            savingMsg();
        });
    }
}]);

app.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
