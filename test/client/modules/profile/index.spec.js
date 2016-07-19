describe("Profile page", () => {
    let scope, ctrl, httpBackend, uibModal, profileService, toastr, location;
    const profileURL = 'api/users/profile';
    const testJson = {
        userName: "ingrid",
        userAge: 30,
        userEmail: "ingrid@example.com",
        userImg: "user-image.jpg"
    };

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(angular.mock.module(($provide) => {
        $provide.value('profileService', {
            getProfile: () => {
                return {
                    then: (callback) => {
                        return callback([testJson])
                    }
                }
            }
        })
    }));

    beforeEach(inject(($controller, $httpBackend, $location, _profileService_) => {
        scope = {};
        uibModal = {};
        toastr = {};
        toastr.success = () => {};

        profileService = _profileService_;
        // profileService = {};
        // profileService.saveChanges = () => {};
        // profileService.update = () => {};
        // profileService.getProfile = () => {return testJson};
        // profileService.getProfile()
        //     .then((testJson) => {
        //         return testJson;
        //     });
        //
        // scope.init = () => {return testJson};
        scope.getSalt = () => {};
        httpBackend = $httpBackend;
        location = $location;

        ctrl = $controller('manageProfileController', {$scope: scope, $uibModal: uibModal, profileService: profileService, toastr: toastr, $location: location
        });
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("should have predefined values", () => {
        expect(scope.emailStatus).toBeDefined();
        expect(scope.emailStatus).toBe(true);

        expect(scope.nameMinLength).toBe(Number(5));
        expect(scope.nameMinLength).toEqual(5);
        expect(scope.nameMaxLength).toEqual(15);
        expect(scope.passMinLength).toEqual(6);
        expect(scope.passMaxLength).toEqual(12);
    });

    // fit("should be empty at the beginning", () => {
    //     expect(scope.user.userName).toEqual("");
    // });
    //
    // fit("should fill up with data", () => {
    //     // let userInfo = httpBackend.when('PUT', profileURL + '/updateUser/')
    //     //     .respond(testJson);
    //     let userInfo = {};
    //
    //     console.log(scope.saveChanges(testJson), 'scope.saveChanges(testJson)');
    //
    //     expect(profileService.update(userInfo)).toEqual(scope.saveChanges(testJson));
    //
    //     // httpBackend.flush();
    // });

    it("mocks the Date object and sets it to a given time", () => {
        const baseTime = new Date(1985, 9, 23);
        const timeDiff = 50;
        const timeMsec = 100;

        jasmine.clock().install();
        jasmine.clock().mockDate(baseTime);

        jasmine.clock().tick(timeDiff);
        expect(scope.getSalt()).toEqual("?salt=" + baseTime.getTime() / timeMsec + timeDiff);
    });

});
