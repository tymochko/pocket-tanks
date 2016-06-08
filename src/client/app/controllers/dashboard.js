app.controller('DashboardCtrl', ['$scope', '$route', '$routeParams', '$http', function($scope, $route, $routeParams, $http) {
    $scope.params = $routeParams;

    // var cat = $routeParams['cat'],
    //  id = $routeParams['id'];

    $http.get('/users').then(function(response){
        $scope.users = response.data;
    //  $scope.album = response.data.photos;
    //  $scope.name = response.data.album.name;
    });

    $scope.sendInvite = function(id){
        console.log(id);
    }

    // angular.forEach($scope.categories, function(catItem, key) {
    //  if (catItem['name'] == cat){
    //      angular.forEach(catItem.albums, function(album, value) {
    //          if (album['id'] == id){
    //              $scope.name = album.name;
    //              $scope.album = album.photos;
    //          }
    //      });
    //  }
    // });

    // var cat_is = cat,
    //  alb_is = id;

    // $scope.isSet = function(checkCat) {
    //  return cat_is === checkCat;
    // };

    // $scope.setCat = function(setCat) {
    //  cat_is = setCat;
    // };

    // $scope.isAlbum = function(checkAlb){
    //  return alb_is === checkAlb;
    // }
}]);