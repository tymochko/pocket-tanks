app
	.controller('NavigationCtrl', ['$scope', '$http', 'routeNavigation', function($scope, $http, routeNavigation) {

		var i;
	    var routes = $scope.routes = [];
	    $scope.userId = null;

	    $http.get('/users/userOne').then(function(response) {
	        $scope.userId = response.data.userId;
	        console.log($scope.userId);
	    });

	    if($scope.userId) {
	    	for (i = 0; i < routeNavigation.routes.length; i++)
	    		if(routeNavigation.routes[i].log == true) {
	    			routes.push(routeNavigation.routes[i]);
	    		}
	    	$scope.activeRoute = routeNavigation.activeRoute;
	    }
	    else {
	    	for (i = 0; i < routeNavigation.routes.length; i++)
	    		if(routeNavigation.routes[i].log == false) {
	    			routes.push(routeNavigation.routes[i]);
	    		}
	    }

        $scope.items = [];

        $scope.open = function() {
            console.log('open() started');
            var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'src/client/views/login.html',
                    controller: 'LoginCtrl',
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
                console.log('open() ending');
        }

        $scope.logOut = function(id) {
            $http.post('/users/logout', {id: id}).then(function(response){
                    $window.location.reload();
                    $scope.userId = null;
            });
        }

	}])


	.directive('navigation', function (routeNavigation) {
	    return {
	        restrict: "E",
	        replace: true,
	        templateUrl: "src/client/views/navigation.html",
	        // controller: function ($scope) {
	        //     $scope.routes = routeNavigation.routes;
	        //     $scope.activeRoute = routeNavigation.activeRoute;
	        // }
	        controller: 'NavigationCtrl'
	    };
	})


	.factory('routeNavigation', function($route, $location) {
	    var routes = [
	    	{template: 'dashboard', name: 'Dashboard', pos: 'left', log: true, click: '' },
	    	{template: 'scores', name: 'Scores', pos: 'left', log: true, click: '' },
	    	{template: 'about', name: 'About', pos: 'left', log: true, click: '' },
	    	{template: 'profile', name: 'Profile', pos: 'right', log: true, click: '' },
	    	{template: '', name: 'Log Out', pos: 'right', log: true, click: 'logOut(userId)' },
	    	{template: 'signup', name: 'Sign Up', pos: 'right', log: false, click: '' },
	    	{template: '', name: 'Log In', pos: 'right', log: false, click: 'open()' }
	    ];
	    // angular.forEach($route.routes, function (route, path) {
	    //     if (route.name) {
	    //         routes.push({
	    //             path: path,
	    //             name: route.name
	    //         });
	    //     }
	    // });
	    return {
	        routes: routes,
	        activeRoute: function (route) {
	            return route.path === $location.path();
	        }
	    };
	});