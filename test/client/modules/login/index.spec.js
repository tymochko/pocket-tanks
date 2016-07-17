describe('LoginCtrl', function() {
    var $controller, scope, uibModalInstance, items, sendLog;
    var controller;

    beforeEach(angular.mock.module("tanks.login"));

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

        it('minLengthName', function() {
            expect(scope.minLengthName).toEqual(5);
        });

        it('maxLengthName', function() {
            expect(scope.maxLengthName).toEqual(15);
        });

        it('minLengthPass', function() {
            expect(scope.minLengthPass).toEqual(6);
        });

        it('maxLengthPass', function() {
            expect(scope.maxLengthPass).toEqual(12);
        });
    });

    describe('Testing controller functions', function() {
        it("$scope.login check", function () {
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
