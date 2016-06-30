app.controller('SliderCtrl', ['$scope', '$uibModal', '$compile', function ($scope, $uibModal, $compile) {
  $scope.myInterval = 2000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.animationsEnabled = true;

  $scope.open = function () {
  	console.log('111');
    // var modalInstance = $uibModal.open({
    //   //animation: $scope.animationsEnabled,
    //   template: 'fkgns',
    //   controller: 'ModalInstanceCtrl'
    //   });

  };

  $scope.addSlide = function(imageNum) {
    slides.push({
      image: 'public/images/home/' + imageNum +'.jpg',
      id: currIndex++
    });
  };

  for (var i = 0; i < 9; i++) {
    $scope.addSlide("0" + (i+1));
    $scope.open();
  };
  
  ////////////////////////////////////////////////////

}]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', ['$scope','$uibModalInstance',  function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);