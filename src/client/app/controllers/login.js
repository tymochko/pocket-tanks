app.controller('LoginCtrl', 
	['$scope', 'sendLog', '$http', '$location', '$uibModalInstance', 'items', 'Auth', 
	function($scope, sendLog, $http, $location, $uibModalInstance, items, Auth) {

	$scope.user = {
		name : "",
		password: ""
	};

	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};


	$scope.register = function(user){
		console.log($scope.user);
		let userInfo = {
			userName : user.name,
			userPassword : user.password
		};
		sendLog.add(userInfo);

		$http.post('/users/login', userInfo)
		  .then(function(response) {
		  		Auth.setUser(user);
    			$uibModalInstance.close($scope.selected.item);
		  }, function(response) {
		      console.log('failed');
		  });
	};
}]);

app.service('sendLog',['$http', '$location', function($http, $location){
	this.add = function(userInfo){
		return $http.post('http://localhost:3000/users/login', userInfo).then(function(res){
			$location.path('/');
			$('.hide-after-log').addClass('hidden');
    		$('.show-after-log').removeClass('hidden');
		});
	};
}]);

app
	.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
	    $rootScope.$on('$routeChangeStart', function (event) {

	        if (!Auth.isLoggedIn()) {
	            console.log('DENY');
	            //event.preventDefault();
	            $('.show-after-log').addClass('hidden');
    			$('.hide-after-log').removeClass('hidden');
	        }
	        else {
	            console.log('ALLOW');
	        }
	    });
	}])

	.factory('Auth', function(){
		var user;

		return{
		    setUser : function(aUser){
		        user = aUser;
		    },
		    isLoggedIn : function(){
		        return(user)? user : false;
		    }
		  }
	});