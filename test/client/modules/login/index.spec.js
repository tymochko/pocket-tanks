describe('Login controller test', function() {
    var scope, httpBackend, createController, uibModalInstance, items, $window;

    beforeEach(angular.mock.module("tanks.login"));

    beforeEach(inject(function ($rootScope, $httpBackend, $controller) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        uibModalInstance = {};
        uibModalInstance.success = function () {

        };
        items = [];
        $window = {};

        createController = function() {
            return $controller('LoginCtrl', {
                '$scope': scope,
                '$http': httpBackend,
                '$uibModalInstance': uibModalInstance,
                'items': items,
                '$window': $window
            });
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


     it("success response - empty array from server", function () {
        var controller = createController();
        scope.urlToScrape = 'success.com';
        var uibModalInstance = {};
        uibModalInstance.success = function () {

        };

        httpBackend.expect('POST', 'api/users/login').respond(200);
        var success;
        var userInfo = {
            userName: 'Jack',
            userPassword: 'Black'
        }, 
            items = [], $window = {};
        // call logOut
        scope.login(userInfo).then(function () {
            success = true;
        });        
        httpBackend.flush();
        // verification
        expect(success).toBe(true);


    });

});








// describe('Login controller test', function() {
//     var $controller, httpBackend;

//     beforeEach(angular.mock.module("tanks.login"));

//     beforeEach(inject(function (_$controller_, $httpBackend) {
//         $controller = _$controller_;
//         httpBackend = $httpBackend;
//     }));

//      it("success response - empty array from server", function () {
//         var $scope = {};
//         var uibModalInstance = {};
//         uibModalInstance.success = function () {

//         };

//         httpBackend.expect('POST', 'api/users/login').respond(200);
//         var success;
//         var userInfo = {}, items = [], $window = {};
//         var controller = $controller('LoginCtrl', { $scope: $scope, $http: httpBackend, $uibModalInstance: uibModalInstance, items: items, $window: $window });
//         // call logOut
//         controller.login().then(function (userInfo) {
//             success = true;
//         });        
//         httpBackend.flush();
//         // verification
//         expect(success).toBe(true);
//     });

// });