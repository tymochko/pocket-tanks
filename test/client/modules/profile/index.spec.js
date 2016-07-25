<<<<<<< HEAD
describe("Profile page", () => {
    let scope, ctrl, uibModal, ProfileService, toastr, location, userInfo;
    const testJson = {
        userName: "ingrid",
        userAge: 30,
        userEmail: "ingrid@example.com",
        userImg: "user-image.jpg"
    };

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(angular.mock.module(($provide) => {
        $provide.value('ProfileService', {
            getProfile: () => {
                return {
                    then: () => {
                        return testJson;
                    }
                }
            },

            update: (json) => {
                userInfo = json;
                return userInfo;
            }
        })
    }));

    beforeEach(inject(($controller, $httpBackend, $location, _ProfileService_) => {
        scope = {};
        uibModal = {};
        toastr = {};
        toastr.success = () => {};

        ProfileService = _ProfileService_;
        location = $location;

        ctrl = $controller('ManageProfileController', {$scope: scope, $uibModal: uibModal, ProfileService: ProfileService, toastr: toastr, $location: location
        });
    }));

    it("should have predefined values", () => {
        expect(scope.emailStatus).toBeDefined();
        expect(scope.emailStatus).toBe(true);

        expect(scope.nameMinLength).toBe(Number(5));
        expect(scope.nameMinLength).toEqual(5);
        expect(scope.nameMaxLength).toEqual(15);
        expect(scope.passMinLength).toEqual(6);
        expect(scope.passMaxLength).toEqual(12);
    });

    it("should be empty at the beginning", () => {
        expect(scope.user.userName).toEqual('');
    });

    it("should fill up with data", () => {
        scope.user = ProfileService.getProfile().then();

        expect(scope.user.userName).toEqual('ingrid');
    });
=======
// describe("Profile page", () => {
//     let scope, ctrl, uibModal, profileService, toastr, location, userInfo;
//     const testJson = {
//         userName: "ingrid",
//         userAge: 30,
//         userEmail: "ingrid@example.com",
//         userImg: "user-image.jpg"
//     };

//     beforeEach(angular.mock.module("tanks.profile"));

//     beforeEach(angular.mock.module(($provide) => {
//         $provide.value('profileService', {
//             getProfile: () => {
//                 return {
//                     then: () => {
//                         return testJson;
//                     }
//                 }
//             },

//             update: (json) => {
//                 userInfo = json;
//                 return userInfo;
//             }
//         })
//     }));

//     beforeEach(inject(($controller, $httpBackend, $location, _profileService_) => {
//         scope = {};
//         uibModal = {};
//         toastr = {};
//         toastr.success = () => {};

//         profileService = _profileService_;
//         location = $location;

//         ctrl = $controller('manageProfileController', {$scope: scope, $uibModal: uibModal, profileService: profileService, toastr: toastr, $location: location
//         });
//     }));

//     it("should have predefined values", () => {
//         expect(scope.emailStatus).toBeDefined();
//         expect(scope.emailStatus).toBe(true);

//         expect(scope.nameMinLength).toBe(Number(5));
//         expect(scope.nameMinLength).toEqual(5);
//         expect(scope.nameMaxLength).toEqual(15);
//         expect(scope.passMinLength).toEqual(6);
//         expect(scope.passMaxLength).toEqual(12);
//     });

//     it("should be empty at the beginning", () => {
//         expect(scope.user.userName).toEqual('');
//     });

//     it("should fill up with data", () => {
//         scope.user = profileService.getProfile().then();

//         expect(scope.user.userName).toEqual('ingrid');
//     });
>>>>>>> second_tank
    
//     it("should pass data when saveChanges", () => {
//         expect(userInfo).toBe(undefined);

<<<<<<< HEAD
        scope.user = ProfileService.getProfile().then();
        scope.saveChanges(scope.user);
=======
//         scope.user = profileService.getProfile().then();
//         scope.saveChanges(scope.user);
>>>>>>> second_tank

//         expect(userInfo.userName).toEqual('ingrid');
//     });

//     it("mocks the Date object and sets it to a given time", () => {
//         const baseTime = new Date(1985, 9, 23);

//         jasmine.clock().install();
//         jasmine.clock().mockDate(baseTime);

//         expect((scope.getSalt)()).toEqual("?salt=" + baseTime.getTime());
//     });

// });
