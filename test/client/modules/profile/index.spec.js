const testJson = {
    userName: "ingrid",
    userAge: 30,
    userEmail: "ingrid@example.com"
};

describe("Test profile page", function () {
    var profileService, httpBackend;
    const profileURL = 'api/users/profile';

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(inject(function (_profileService_, _$httpBackend_) {
        profileService = _profileService_;
        httpBackend = _$httpBackend_;
    }));

    // tests for 'getProfile' route
    fit("'getProfile' route should return object with 3 properties", function () {

        httpBackend.when('GET', profileURL)
            .respond(testJson);
        expect(testJson).toEqual({
            userName: "ingrid",
            userAge: 30,
            userEmail: "ingrid@example.com"
        });
    });

    fit("'getProfile' route to return object, not an array", function () {

        httpBackend.when('GET', profileURL)
            .respond(testJson);
        expect(testJson).not.toEqual([1, 3]);
    });

    fit("'getProfile' route to return object, not boolean", function () {

        httpBackend.when('GET', profileURL)
            .respond(testJson);
        expect(testJson).not.toEqual(true);
    });

    // fit("'getProfile' route should not return userAge property not an integer", function () {
    //
    //     httpBackend.when('GET', profileURL)
    //         .respond(testJson);
    //     expect(testJson.userAge).not.toEqual('Hello');
    // });
    //
    // fit("'getProfile' route should not return userAge property not an integer", function () {
    //
    //     httpBackend.when('GET', profileURL)
    //         .respond(testJson);
    //     expect(testJson.userAge).not.toEqual(true);
    // });

    // fit("'getProfile' route should not return userAge property not an integer", function () {
    //
    //     httpBackend.when('GET', profileURL)
    //         .respond({
    //             userAge: 'Hello'
    //         });
    //     profileService.getProfile().then((responce) => {
    //         expect(responce.userAge).toBe(Number);
    //     });
    // });

});
