var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.profile', [
    ngRoute
]).config(RouteConfig)


    .service('profileService', ['$http', function ($http) {
        var userId = '';
        const profileURL = 'api/users/profile';
// todo add norm function without param + change name
        this.getProfileById = () => {//todo all changes to config
            return $http.get(profileURL);
        };
        this.getPublicImages = () => {
            return $http.get(profileURL + '/publicImages');
        };
        this.deleteAccount = () => {
            return $http.put(profileURL + '/delete/', {id: userId});
        };

        this.update = function (userInfo) {
            return $http.put(profileURL + '/updateUser/', userInfo).then(function () {
                console.log('ok');
            });
        }
    }])
    .controller('MyCtrl', ['$http', 'Upload', '$scope', '$uibModalInstance', function ($http, Upload, $scope, $uibModalInstance) {

        $scope.submit = function () {
            var uploadedImg;

            if ($scope.upload_form.file.$valid && $scope.file) {
                //check if from is valid
                $scope.upload($scope.file);


            }
        };

        $scope.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/api/users/profile/upload',
                data: {file: file}
            }).then(function (resp) {
                uploadedImg = resp.data;
                $uibModalInstance.close(uploadedImg);
            });

        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    }])
    .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('avatarController', ['$http', '$scope', '$uibModalInstance', '$uibModal', 'profileService', function ($http, $scope, $uibModalInstance, $uibModal, profileService) {
        $scope.images = [];
        $scope.customImages = [];
        profileService.getPublicImages().then((res) => {
            $scope.images = res.data;
            $scope.setCurrentImage($scope.images[0]);
        }).catch((err) => {
            console.log(err);
        });

        $scope.setCurrentImage = function (image) {
            $scope.currentImage = image;
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.currentImage);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.uploadPhoto = function () {

            let modalInstance3 = $uibModal.open({
                animation: true,
                templateUrl: 'profile/uploadContent.html',
                controller: 'MyCtrl'
            });
            modalInstance3.result.then(function (img) {
                $scope.customImages = [];
                $scope.customImages.push(img);
                $scope.setCurrentImage(img);


                // console.log(img);
                // $scope.images.push(img);
                // $scope.currentImage = $scope.images[$scope.images.length - 1];
                // console.log($scope.images);
            })

        };

    }]),
// .directive(directiveId, ['$parse', function ($parse) {
//     var directive = {
//         link: link,
//         restrict: 'A',
//         require: '?ngModel'
//     };
//     return directive;
//     function link(scope, elem, attrs, ctrl) {
//         var firstPassword = $parse(attrs[directiveId]);
//         var validator = function (value) {
//             var temp = firstPassword(scope),
//                 v = value === temp;
//             ctrl.$setValidity('match', v);
//             return value;
//         }
//         ctrl.$parsers.unshift(validator);
//         ctrl.$formatters.push(validator);
//         attrs.$observe(directiveId, function () {
//             validator(ctrl.$viewValue);
//         });
//     };
// }])
//

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
    $scope.selectedImg = "api/users/profile/getImage/userAvatar" + getSalt();

    $scope.user = {
        userName: "",
        userImg: {},
        userEmail: "",
        userPassword: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        userAge: ""
    };

    function getSalt (){
        return "?salt=" + new Date().getTime();
    }

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
        //todo rename getProfile!!!
        profileService.getProfileById().then(function (resp) {
            $scope.user = resp.data;
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

            userInfo.userOldPassword = user.oldPassword;
            userInfo.userNewPassword = user.newPassword;
            // TODO should be changed back when working
            // userInfo.userConfPassword= user.confirmNewPassword;
            userInfo.userConfPassword = user.newPassword;

        }
        console.log(userInfo);
        profileService.update(userInfo);
        savingMsg();

    };

// Delete popup controller;
   // todo rename))))
    $scope.open = function () {

        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'profile/myModalContent.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function () {
            profileService.deleteAccount();
            $scope.logOut($scope.user._id);
            $location.path('/');
        })
    };

    $scope.changeAvatar = function () {
        modalWindow();
    };

    function modalWindow() {

        let modalInstance2 = $uibModal.open({
            animation: true,
            templateUrl: 'profile/avatarContent.html',
            controller: 'avatarController'
        });
        modalInstance2.result.then(function (img) {
            avatarMsg();
            $scope.avatar = img;
            $scope.user.userImg = $scope.avatar;
            $scope.selectedImg = img.image;
        })

    }
};
