var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.profile', [
    ngRoute
]).config(RouteConfig)
.service('profileService', ['$http', function ($http) {
    var userId = '';
// todo add norm function without param + change name
    this.getProfileById = (id) => {//todo all changes to config
        return $http.get("http://localhost:3000/api/users/profile/", id);
    };

    this.deleteAccount = () => {
        return $http.put('http://localhost:3000/api/users/profile/delete/', {id: userId});
    };

    this.update = function (userInfo) {
        return $http.put('http://localhost:3000/api/users/profile/updateUser/', userInfo).then(function(response) {
            console.log('ok');
        });
    }
}])
.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('avatarController', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    $scope.images = [
        {image: 'public/images/avatars/phoca.jpg', description: 'Oh... So beautiful phoca!'},
        {image: 'public/images/avatars/bear.jpg', description: 'So cute...bear!'},
        {image: 'public/images/avatars/dog.jpg', description: 'Who let the dogs out?!'},
        {image: 'public/images/avatars/deer.jpg', description: 'Am...yes i am deer!'},
        {image: 'public/images/avatars/cat.jpg', description: 'Just give me some food for Myaw!'}
    ];
    $scope.currentImage = $scope.images[0];
    $scope.setCurrentImage = function (image) {

        $scope.currentImage = image;
    };
    $scope.ok = function () {
        $uibModalInstance.close($scope.currentImage);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.directive('validPasswordMatch', function () {
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

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/profile', {
        controller: manageProfileController,
        templateUrl: 'profile/manageProfile.html'
    });
};

function manageProfileController($scope, $uibModal, profileService, toastr, $location) {
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
        userInfo = {
            userName: user.userName,
            userAge: user.userAge,
            userEmail: user.userEmail,
            userImg: user.userImg
        };
        if (user.oldPassword) {
// <<<<<<< HEAD
//                     if (user.newPassword === user.confirmNewPassword) {
//                         let userInfo = {
//                             _id: $scope.userId,
//                             userName: user.userName,
//                             userAge: user.userAge,
//                             userEmail: user.userEmail,
//                             userImg: user.userImg,
//                             userOldPassword:user.oldPassword,
//                             userNewPassword:user.newPassword,
//                             userConfPassword:user.confirmNewPassword
//                         };
//                         profileService.update(userInfo);

//                     }
// =======
            userInfo.userOldPassword= user.oldPassword;
            userInfo.userNewPassword= user.newPassword;
            userInfo.userConfPassword= user.confirmNewPassword;
        }
            console.log(userInfo);
        profileService.update(userInfo);
            savingMsg();



        };

// Delete popup controller;
    $scope.open = function () {

        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: './src/client/views/views/myModalContent.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function () {
            profileService.deleteAccount();
            $scope.logOut($scope.user._id);
            $location.path('/');
        })
    };

    $scope.changeAvatar = function () {

        let modalInstance2 = $uibModal.open({
            animation: true,
            templateUrl: './src/client/views/views/avatarContent.html',
            controller: 'avatarController'
        });
        modalInstance2.result.then(function (img) {
            avatarMsg();
            $scope.avatar = img;
            $scope.user.userImg = $scope.avatar;
        })
    };

};