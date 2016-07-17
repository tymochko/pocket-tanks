describe('LoginCtrl', function() {

    var $controller, scope, uibModalInstance, items, sendLog;
    var controller;

    beforeEach(angular.mock.module("tanks.login"));

    describe('Testing sendLog service', function() {
        var httpBackend;

        beforeEach(inject(function(_sendLog_, _$httpBackend_) {
            sendLog = _sendLog_;
            httpBackend = _$httpBackend_;
        }));

        fit('sendLog.log should be defined', function() {
            httpBackend.whenRoute('POST', 'api/users/login/');
            expect(sendLog.log).toBeDefined();
        });

    });


    beforeEach(inject(function($rootScope, _$controller_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    beforeEach(inject(function() {
            sendLog = {};

            controller = $controller('LoginCtrl', { $scope: scope, sendLog: sendLog, $uibModalInstance: uibModalInstance, items: items});
            uibModalInstance = {};
            uibModalInstance.close = function () {

            };
            
            items = [];
    }));

    describe('Testing controller variables', function() {

        fit('minLengthName', function() {
            expect(scope.minLengthName).toEqual(5);
        });

        fit('maxLengthName', function() {
            expect(scope.maxLengthName).toBeDefined();
        });

        fit('minLengthPass', function() {
            expect(scope.minLengthPass).toEqual(6);
        });

        fit('maxLengthPass', function() {
            expect(scope.maxLengthPass).toBeDefined();
        });

    });

    describe('Testing controller functions', function() {

        fit("$scope.login check", function () {
            var succeeded;
            var userInfo = {
                userName: 'Jack',
                userPassword: 'Black'
            };

            sendLog.log = function(userInfo, scope, uibModalInstance, items) {
                succeeded = true;
            };
            
            scope.login(userInfo);
        });

    });

});
