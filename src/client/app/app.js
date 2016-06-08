var app = angular.module("tanks", ['ngRoute','ngAnimate', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'src/client/views/home.html',
            controller: 'SliderCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'src/client/views/dashboard.html',
            controller: 'DashboardCtrl'
        })

        /*Login Form Route*/
        .when('/login', {
            templateUrl: 'src/client/views/login.html',
            controller: 'LoginSubmitController'
        })

        .otherwise({
            redirectTo: '/404.html'
        });

    $locationProvider.html5Mode(true);
}]);
