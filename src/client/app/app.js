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


//////////////////////// for navbar (needs new file)
function notLogged() {
    $('.show-after-log').addClass('hidden');
    $('.hide-after-log').removeClass('hidden');
}

function logIn() {
    $('.hide-after-log').addClass('hidden');
    $('.show-after-log').removeClass('hidden');
}