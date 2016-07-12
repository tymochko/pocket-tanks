describe("App Controller test", function () {
    var $controller;

    beforeEach(angular.mock.module("tanks.profile"));
   // beforeEach(angular.mock.module("angular-animate"));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    it("Should have 2 items after load", function () {
        var $scope = {};
        var controller = $controller('testCtrl', { $scope: $scope });
        expect($scope.mass).toEqual(false);
        $scope.set(true);
        expect($scope.mass).toEqual(true);
    })
});