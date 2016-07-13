describe('LoginCtrl', function() {
    var scope, httpBackend, createController;

    beforeEach(angular.mock.module("tanks.login"));

    beforeEach(inject(function($rootScope, $httpBackend, $controller) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();

        createController = function() {
            return $controller('LoginCtrl', {
                '$scope': scope
            });
        };
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should run the Test to get the link data from the go backend', function() {
        var controller = createController();
        scope.urlToScrape = 'success.com';

        httpBackend.expect('GET', '/slurp?urlToScrape=http:%2F%2Fsuccess.com')
            .respond({
                "success": true,
                "links": ["http://www.google.com", "http://angularjs.org", "http://amazon.com"]
            });

        // have to use $apply to trigger the $digest which will
        // take care of the HTTP request
        scope.$apply(function() {
            scope.runTest();
        });

        expect(scope.parseOriginalUrlStatus).toEqual('calling');

        httpBackend.flush();

        expect(scope.retrievedUrls).toEqual(["http://www.google.com", "http://angularjs.org", "http://amazon.com"]);
        expect(scope.parseOriginalUrlStatus).toEqual('waiting');
        expect(scope.doneScrapingOriginalUrl).toEqual(true);
    });
});