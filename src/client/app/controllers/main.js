app.controller('mainCtrl', ['$scope', '$uibModal', '$log', '$location', '$http', '$window',
    function($scope, $uibModal, $log, $location, $http, $window) {

        $http.get("http://localhost:3000/api/users/profile/").then(function(res) {
            if(res.data.isOnline) {
                $('.hide-after-log').addClass('hidden');
                $('.show-after-log').removeClass('hidden');
            }
            else {
                $('.show-after-log').addClass('hidden');
                $('.hide-after-log').removeClass('hidden');
                //session is always alive!!!!!!! Yuri... :(
                console.log('isOnline: false\nBut session is still ALIVE. Whyyyy, whyyyyyyy?:\'(');
                console.log('and _id as a proof: ' + res.data._id);
            }

        }, function(res) {
            console.log('really NOT logged in');
        });

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
        };

        $scope.logOut = function(id) {
            $http.post('api/users/logout', {id: id}).then(function(response){
                    
                    $window.location.reload();
            });
        };
    }
]);