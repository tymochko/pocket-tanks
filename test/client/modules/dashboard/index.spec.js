describe("Testing dashboard", function () {
    var $httpBackend, $controller;

    var fakeSocket = {
        on: function() {},
        emit: function() {}
    };

    beforeEach(angular.mock.module("tanks.dashboard"));

    beforeEach(() => {
        inject((_$controller_, _$httpBackend_) => {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', 'api/users').respond({users: []});
        });
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("calls api/users", inject(($http) => {
        var $scope = {};
        $httpBackend.expectGET('api/users');
        var controller = $controller('DashboardCtrl', {
            $scope: $scope,
            $http: $http,
            socket: fakeSocket
        });
        $httpBackend.flush();
    }));

    it("emits socket event", inject(($http) => {
        var $scope = {};
        spyOn(fakeSocket, 'emit');
        var controller = $controller('DashboardCtrl', {
            $scope: $scope,
            $http: $http,
            socket: fakeSocket
        });
        $scope.sendInvite();
        expect(fakeSocket.emit).toHaveBeenCalled();
        $httpBackend.flush();
    }));
});
