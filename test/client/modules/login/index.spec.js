describe('LoginCtrl', function() {

    var $controller, scope, uibModalInstance, items, sendLog, loginResult, httpBackend;
    var controller;

    beforeEach(angular.mock.module("tanks.login"));

    // describe('Testing sendLog service', function() {
    //     var httpBackend;

    //     beforeEach(inject(function(_sendLog_, _$httpBackend_) {
    //         sendLog = _sendLog_;
    //         httpBackend = _$httpBackend_;
    //     }));

    //     fit('sendLog.log should be defined', function() {
    //         httpBackend.whenRoute('POST', 'api/users/login/');
    //         expect(sendLog.log).toBeDefined();
    //     });

    // });


    beforeEach(inject(function($rootScope, _$controller_, _loginResult_, _$httpBackend_, _sendLog_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        loginResult = _loginResult_;
        httpBackend = _$httpBackend_;
        sendLog = _sendLog_;
    }));

    beforeEach(inject(function() {
        //sendLog = {};

        controller = $controller('LoginCtrl', { $scope: scope, sendLog: sendLog, $uibModalInstance: uibModalInstance, items: items, loginResult: loginResult});
        uibModalInstance = {};
        uibModalInstance.close = function () {

        };

        items = [];
    }));


    describe('Testing controller variables', function() {

        fit('minLengthName', function() {
            expect(scope.minLengthName).toEqual(5);
            expect(scope.minLengthName).not.toEqual(6);
        });

        fit('maxLengthName', function() {
            expect(scope.maxLengthName).toEqual(15);
            expect(scope.maxLengthName).not.toEqual(12);
        });

        fit('minLengthPass', function() {
            expect(scope.minLengthPass).toEqual(6);
            expect(scope.minLengthPass).not.toEqual(5);
        });

        fit('maxLengthPass', function() {
            expect(scope.maxLengthPass).toEqual(12);
            expect(scope.maxLengthPass).not.toEqual(15);
        });

    });


    describe('Testing controller functions', function() {

        fit("$scope.login check", function () {
            // var succeeded;
            var userInfo = {
                userName: 'Jack',
                userPassword: 'Black'
            };

            // sendLog.log = function(userInfo, scope, uibModalInstance, items, loginResult) {

            // };

            // httpBackend.whenRoute('POST', 'api/users/login/');

            sendLog.log.success = function() {
                console.log('SUCCESS');
            };
            sendLog.log = jasmine.createSpy('sendLog.log.success() spy');

            sendLog.log.error = function() {
                console.log('ERROR');
            };
            sendLog.log.error = jasmine.createSpy('sendLog.log.error() spy');


            scope.login(userInfo);
            // expect(succeeded).toBe(true);
            expect(sendLog.log).toHaveBeenCalled();
            // expect(sendlog.log.success).toHaveBeenCalled();
            // expect(sendlog.log.error).toHaveBeenCalled();
        });

    });

});
