
app.controller('manageProfileController', ['$scope', '$uibModal', 'profileService', 'toastr', function ($scope, $uibModal, profileService, toastr) {
    $scope.emailStatus = true;

    $scope.nameMinLength = 5;
    $scope.nameMaxLength = 15;
    $scope.passMinLength = 6;
    $scope.passMaxLength = 12;
    $scope.user = {
        userName: "",
        userImg: {},
        userEmail: "",
        userPassword: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        userAge:""
    };

    function savingMsg() {
        toastr.success('Your changes are saved!', 'Message', {
            closeButton: true,
            closeHtml: '<button>&times;</button>'
        })
    }
    function avatarMsg() {
        toastr.warning('Do not forget to save changes!!', 'Message', {
            closeButton: true,
            closeHtml: '<button>&times;</button>'
        })
    }

    let init = function () {
        profileService.getProfileById($scope.userId).then(function (resp) {
            //todo
            $scope.user = resp.data;
            $scope.avatar = $scope.user.userImg;
        });
    };

    init();

    $scope.saveChanges = function (user) {
        let userInfo = {};
        if (user.oldPassword) {
                        userInfo = {
                            userName: user.userName,
                            userAge: user.userAge,
                            userEmail: user.userEmail,
                            userImg: user.userImg,
                            userPassword: user.newPassword
                        };

                        profileService.update(userInfo);



        }
        else {

            let userInfo = {
                userName: user.userName,
                userAge: user.userAge,
                userEmail: user.userEmail,
                userImg: user.userImg
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
    $scope.changeAvatar = function () {

        let modalInstance2 = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './src/client/views/views/avatarContent.html',
            controller: 'avatarController'
        });
        modalInstance2.result.then(function (img) {
            avatarMsg();
            $scope.avatar = img;
            $scope.user.userImg = $scope.avatar;
        })
    };

    $scope.toggleAnimation = () => {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}]);

app.service('profileService', ['$http', function ($http) {
    var userId = '';
// todo add norm function without param + change name
    this.getProfileById = (id) => {//todo all changes to config
        return $http.get("http://localhost:3000/api/users/profile/", id);
    };

    this.deleteAccount = () => {
        return $http.put('http://localhost:3000/api/users/profile/delete/', {id: userId});
    };

    this.update = function (userInfo) {
        $http.put('http://localhost:3000/api/users/profile/updateUser/', userInfo).then(function (response) {
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

app.controller('avatarController', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    $scope.images = [
        {image: 'public/images/avatars/phoca.jpg', description: 'Oh... So beautiful phoca!'},
        {image: 'public/images/avatars/bear.jpg', description: 'So cute...bear!'},
        {image: 'public/images/avatars/dog.jpg', description: 'Who let the dogs out?!'},
        {image: 'public/images/avatars/deer.jpg', description: 'Am...yes i am deer!'},
        {image: 'public/images/avatars/cat.jpg', description: 'Just give me some food for Myaw!'}
    ];

    $scope.setCurrentImage = function (image) {
        $scope.currentImage = image;
    };
    $scope.ok = function () {
        $uibModalInstance.close($scope.currentImage);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}]);


app.directive('validPasswordMatch', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.profile.newpassword.$viewValue;
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});