app.controller('mainCtrl', ['$scope', '$uibModal', '$log', 'Auth', '$location', '$http', '$window',
    function($scope, $uibModal, $log, Auth, $location, $http, $window) {

        //<------------slider------------->
        $scope.myInterval = 2000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.noPause = true;

        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function(imageNum) {
            slides.push({
                image: 'public/images/home/' + imageNum + '.jpg',
                id: currIndex++
            });
        };

        for (var i = 0; i < 9; i++) {
            $scope.addSlide("0" + (i + 1));
        }
        //<-------------------------------->
        $scope.items = [];

        $scope.animationsEnabled = true;

        $scope.open = function() {
            var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'src/client/views/login.html',
                    controller: 'LoginCtrl',
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        }

        $scope.logOut = function(id) {
            $http.post('/users/logout', {id: id}).then(function(response){
                    $window.location.reload();
            });
        }

        $http.get('/users/userOne').then(function(response) {
            $scope.userId = response.data.userId;
        });
    }
]);