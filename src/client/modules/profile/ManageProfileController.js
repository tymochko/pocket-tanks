import {AvatarController} from "./AvatarController";
import {DeleteUserController} from "./DeleteUserController";
export class ManageProfileController {
    constructor($scope, $uibModal, ProfileService, toastr, $location, $translate, $window) {
        $scope.emailStatus = true;
        $scope.nameMinLength = 5;
        $scope.nameMaxLength = 15;
        $scope.passMinLength = 6;
        $scope.passMaxLength = 15;

        $scope.user = {
            userName: "",
            userImg: {},
            userEmail: "",
            userPassword: "",
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            userAge: "",
            userLanguage: ""
        };

        $scope.getSalt = () => {
            return "?salt=" + new Date().getTime();
        };

        $scope.selectedImg = "api/users/profile/getImage/userAvatar" + ($scope.getSalt)();

        function savingMsg() {
            $translate('savingMsg')
                .then((translatedValue) => {
                    $scope.savingMsg = translatedValue;
                    $translate('avatarTitle').then((translVal) => {
                        $scope.avatarTitle = translVal;
                        toastr.success($scope.savingMsg, $scope.avatarTitle, {
                            closeButton: true,
                            closeHtml: "<button>&times;</button>"
                        });
                    });
                });
            $window.location.reload();
        }

        function avatarMsg() {
            $translate('avatarMsg')
                .then((translatedValue) => {
                    $scope.avatarMsg = translatedValue;
                    $translate('avatarTitle').then((translVal) => {
                        $scope.avatarTitle = translVal;
                        toastr.warning($scope.avatarMsg, $scope.avatarTitle, {
                            closeButton: true,
                            closeHtml: "<button>&times;</button>"
                        });
                    });
            });
        }

        $scope.init = (() => {
            ProfileService.getProfile().then((resp) => {
                $scope.user = resp.data;
                $translate.use($scope.user.userLanguage);
            });
        })();

        $scope.saveChanges = (user) => {
            const userInfo = {
                userName: user.userName,
                userAge: user.userAge,
                userEmail: user.userEmail,
                userImg: user.userImg,
                userLanguage: user.userLanguage
            };

            if (user.oldPassword) {
                userInfo.userOldPassword = user.oldPassword;
                userInfo.userNewPassword = user.newPassword;
                userInfo.userConfPassword = user.newPassword;
            }

            ProfileService.update(userInfo);
            savingMsg();
        };

// Delete popup window;
        $scope.deleteUser = () => {

            const deleteInstance = $uibModal.open({
                animation: true,
                templateUrl: "profile/DeleteContent.html",
                controller: DeleteUserController
            });
            deleteInstance.result.then(() => {
                ProfileService.deleteAccount();
                $scope.logOutClick($scope.user._id);
                $location.path("/");
            });
        };
// change avatar Popup window
        $scope.changeAvatar = () => {
            changeImgWindow();
        };

        function changeImgWindow() {

            const changeInstance = $uibModal.open({
                animation: true,
                templateUrl: "profile/avatarContent.html",
                controller: AvatarController
            });
            changeInstance.result.then((img) => {
                avatarMsg();
                $scope.avatar = img;
                $scope.user.userImg = $scope.avatar;
                $scope.selectedImg = img.image;
            });
        }
        $scope.changeLanguage =(key) => {

            $translate.use(key);
            $scope.user.userLanguage = key;
            avatarMsg();
        };
    }
}