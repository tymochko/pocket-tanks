describe("Profile page", () => {
    let scope, ctrl, httpBackend, uibModal, toastr, location;
    const profileURL = 'api/users/profile';
    const testJson = {
        userName: "ingrid",
        userAge: 30,
        userEmail: "ingrid@example.com",
        userImg: "user-image.jpg"
    };

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(inject(($rootScope, $controller, $httpBackend, $location) => {
        scope = $rootScope.$new();
        uibModal = {};
        toastr = {};
        httpBackend = $httpBackend;
        location = $location;

        ctrl = $controller('manageProfileController', {$scope: scope, $uibModal: uibModal, profileService: httpBackend, toastr: toastr, $location: location
        });
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("should have predefined values", () => {
        expect(scope.emailStatus).toBe(true);
        expect(scope.nameMinLength).toEqual(5);
        expect(scope.nameMaxLength).toEqual(15);
        expect(scope.passMinLength).toEqual(6);
        expect(scope.passMaxLength).toEqual(12);
    });

    describe("Save changes to user's profile", () => {
        it("should be empty at the beginning", () => {
            expect(scope.user.userName).toEqual("");
        });

        it("should fill up with data", () => {
            httpBackend.when('PUT', profileURL + '/updateUser/')
                .respond(testJson);

            scope.saveChanges(testJson);
            // TODO how do I put http request inside of it?
            expect(scope.user.userName).toEqual("ingrid");

            httpBackend.flush();
        });
    });

    describe("Mocking the Date object", () => {
        it("mocks the Date object and sets it to a given time", () => {
            const selectedImg = "api/users/profile/getImage/userAvatar";
            const baseTime = new Date(1985, 9, 23);
            const timeDiff = 50;

            jasmine.clock().install();
            jasmine.clock().mockDate(baseTime);

            jasmine.clock().tick(timeDiff);
            expect(scope.getSalt()).toEqual(selectedImg + "?salt=" + baseTime.getTime() + timeDiff);
            // TODO shows some extra 000 . Why?
        });
    });

});
