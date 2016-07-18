const testJson = {
    userName: "ingrid",
    userAge: 30,
    userEmail: "ingrid@example.com"
};


describe("Test profile page", function () {
    let scope, ctrl, httpBackend, uibModal, toastr, location, $config;
    const profileURL = 'api/users/profile';

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(inject(function ($rootScope, $controller
        // , $httpBackend, _toastr_, $location
    ) {
        scope = $rootScope.$new();
        uibModal = {};
        // httpBackend = $httpBackend;
        // toastr = _toastr_;
        // location = $location;

        ctrl = $controller('manageProfileController', {$scope: scope
            // , $uibModal: uibModal
            // , profileService: httpBackend, toastr: toastr, $location: location
        });
    }));

    fit("should find values", function () {
        expect(scope.nameMinLength).toBeDefined();
        expect(scope.nameMinLength).toEqual(5);
    });


});
