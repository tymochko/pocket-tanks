export class MainController {
    constructor($scope, $uibModal, $log, $location, $http, $window) {
        $scope.myInterval = 2000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.noPause = false;

        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function(imageNum) {
            slides.push({
                image: 'public/images/home_' + imageNum + '.png',
                id: currIndex++
            });
        };

        for (let i = 0; i < 4; i++) {
            $scope.addSlide("0" + (i + 1));
        }
    }
}
