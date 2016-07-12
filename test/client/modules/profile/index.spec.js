describe("Test profile page", function () {
    var profileService, httpBackend;

    beforeEach(angular.mock.module("tanks.profile"));

    beforeEach(inject(function (_profileService_, _$httpBackend_) {
        profileService = _profileService_;
        httpBackend = _$httpBackend_;
    }));

    fit("check for true or false", function () {
        const profileURL = 'api/users/profile';

        httpBackend.whenRoute('PUT', profileURL + '/updateUser/');
        expect(profileService.update).toBeDefined();
    });

});
