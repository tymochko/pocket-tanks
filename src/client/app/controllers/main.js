app.controller('mainCtrl', ['$scope','$uibModal', '$log', 'Auth', '$location', 
	function($scope, $uibModal, $log, $location, Auth) {

//<------------slider-------------> 
	$scope.myInterval = 2000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	$scope.noPause = true;
	var slides = $scope.slides = [];
	var currIndex = 0;

	$scope.addSlide = function(imageNum) {
		slides.push({
			image: 'public/images/home/' + imageNum +'.jpg',
			id: currIndex++
		});
	};

	for (var i = 0; i < 9; i++) {
		$scope.addSlide("0" + (i+1));
	}
//<-------------------------------->
	$scope.items = [];

	$scope.animationsEnabled = true;

	$scope.open = function (param) {
		if(param === 'signUp') {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'src/client/views/signup.html',
				controller: 'SignupCtrl',
				resolve: {
					items: function () {
					  return $scope.items;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
		} else {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'src/client/views/login.html',
				controller: 'LoginCtrl',
				resolve: {
					items: function () {
					  return $scope.items;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
		}
	}

	$scope.logOut = function() {
		$location.path('http://foo.bar')
	}
}]);

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
		  		//logIn();
		  		Auth.setUser(user);
    			$uibModalInstance.close($scope.selected.item);
		  }, function(response) {
		      console.log('failed');
		  });
	};
}]);

app.controller('SignupCtrl', ['$scope', 'sendReg', function($scope, sendReg) {

	$scope.user = {
		name : "",
		age : "",
		email : "",
		password: ""
	};


	$scope.register = function(user){
		console.log($scope.user);
		let userInfo = {
			userName : user.name,
			userAge : user.age,
			userEmail : user.email,
			userPassword : user.password
		};
		sendReg.add(userInfo);
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

app.service('sendReg',['$http', function($http){
	this.add = function(userInfo){
		return $http.post('http://localhost:3000/users/add', userInfo).then(function(res){

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

/////////////////////// for navbar (needs new file)
// function notLogged() {
//     $('.show-after-log').addClass('hidden');
//     $('.hide-after-log').removeClass('hidden');
// }

// function logIn() {
//     $('.hide-after-log').addClass('hidden');
//     $('.show-after-log').removeClass('hidden');
// }

// function checkLog(){
// 	if(Auth.isLoggedIn) logIn();
// 	else notLogged();
// }