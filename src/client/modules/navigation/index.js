var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.navigation', [
    ngRoute
])

.controller('NavigationCtrl', ['$scope', '$http', '$location', '$window', '$uibModal', 'routeNavigation', 'logCheck',
	function($scope, $http, $location, $window, $uibModal, routeNavigation, logCheck) {

	    $scope.items = [];

	    $scope.logInClick = function() {
	        var modalInstance = $uibModal.open({
	            animation: true,
	            templateUrl: 'login/login.html',
	            controller: 'LoginCtrl',
	            resolve: {
	                items: function() {
	                    return $scope.items;
	                }
	            }
	        });
	        modalInstance.result.then(function(selectedItem) {
	            $scope.selected = selectedItem;
	        });
	    };

	    $scope.logOutClick = function () {
	        $http.post('api/users/logout').then(function(response){
	            $window.location.reload();
	        });
	    };

}])


.directive('navigation', function (routeNavigation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "navigation/navigation.html",
        controller: function ($scope) {
            $scope.routes = routeNavigation.routes;
            $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
})

.directive('navDir', function ($http, routeNavigation, navConstructor, logCheck) {
    return {
        template: function () {

            return navConstructor.navBuild(logCheck.check());

        },
        controller: 'NavigationCtrl'
    };
})


.service('logCheck', function($http) {
	this.check = function() {

		$http.get("/api/users/checkSession").then(function(res) {
            console.log(res.data.status == 'success');
            if (res.data.status == 'success') {
                console.log('logged in');
                return true;
            } else if (res.data.status == 'error'){
                console.log('NOT logged in');
                return false;
            }
        }, function(res) {
        });

	};
})

.service('navConstructor', function(routeNavigation){
    this.navBuild = function(logged) {
        console.log(logged);
        let navRight = '<ul class="nav navbar-nav navbar-right"> ';
        if(logged) {

            let href, name, ngClick = "", icon = "";
            let nav = '<ul class="nav navbar-nav"> ',
                navCenter = '<a href="/game" class="btn btn-danger navbar-center">Start GAME</a>';
            for(let i = 0; i < routeNavigation.routes.length; i++) {

                href = ' href="' + routeNavigation.routes[i].template + '"';
                name = routeNavigation.routes[i].name;

                if(routeNavigation.routes[i].click !== "") {
                    ngClick = ' ng-click="' + routeNavigation.routes[i].click + '"';
                }

                if(routeNavigation.routes[i].icon !== "") {
                    icon = '<span class="glyphicon ' + routeNavigation.routes[i].icon + '"></span> ';
                }

                if(routeNavigation.routes[i].log) { //check its working accuracy

                    if(routeNavigation.routes[i].pos === 'left') {
                        nav += ' <li><a' + href + ngClick + '>' + name + '</a></li> ';
                    } else if(routeNavigation.routes[i].pos === 'right'){
                        navRight += ' <li><a' + href + ngClick + '>' + icon + name + '</a></li>';
                    }

                }
            }
            nav += '</ul> ';
            navRight += '</ul>';

            return nav + navCenter + navRight;
        } else {

            for(let i = 0; i < routeNavigation.routes.length; i++) {

                href = ' href="' + routeNavigation.routes[i].template + '"';
                name = routeNavigation.routes[i].name;

                if(routeNavigation.routes[i].click !== "") {
                    ngClick = ' ng-click="' + routeNavigation.routes[i].click + '"';
                }

                if(routeNavigation.routes[i].icon !== "") {
                    icon = '<span class="glyphicon ' + routeNavigation.routes[i].icon + '"></span> ';
                }

                if(routeNavigation.routes[i].pos === 'right' && !routeNavigation.routes[i].log) {
                    navRight += ' <li><a' + href + ngClick + '>' + icon + name + '</a></li>';
                }

            }
            return navRight;
        }
    }
})


.factory('routeNavigation', function($route, $location) {
    var routes = [
        {template: 'dashboard', name: 'Dashboard', pos: 'left', icon: '', log: true, click: '' },
        {template: 'scores', name: 'Scores', pos: 'left', icon: '', log: true, click: '' },
        {template: 'about', name: 'About', pos: 'left', icon: '', log: true, click: '' },
        {template: 'profile', name: 'Profile', pos: 'right', icon: 'glyphicon-user', log: true, click: '' },
        {template: '', name: 'Log Out', pos: 'right', icon: 'glyphicon-log-out', log: true, click: 'logOutClick()' },
        {template: 'signup', name: 'Sign Up', pos: 'right', icon: 'glyphicon-plus', log: false, click: '' },
        {template: '', name: 'Log In', pos: 'right', icon: 'glyphicon-log-in', log: false, click: 'logInClick()' }
    ];

    return {
        routes: routes,
        activeRoute: function (route) {
            return route.path === $location.path();
        }
    };
});
