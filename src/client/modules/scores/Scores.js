export class Scores {
	constructor($scope, $http) {

		$http.get('api/users').then(function(response){
        var users = response.data.users,
        	mylist = [];

		users.forEach(function(item, index){
			var myobj = {};
			myobj.name = item.userName;
			myobj.win = Math.floor((Math.random() * 30) + 0);
			myobj.lose = Math.floor((Math.random() * 30) + 0);
			mylist.push(myobj);
		})

		$scope.mylist = mylist;
    })

		$scope.sortType     = 'name'; // set the default sort type
  		$scope.sortReverse  = false;  // set the default sort order
  		$scope.searchScore   = '';     // set the default search/filter term

  		/*function gold(reverse) {
  			if(reverse == true){
  				console.log('HELLO');
  			}
  		}

  		$scope.gold = gold();

  		if($scope.sortType == 'win' && $scope.sortReverse == true){
  			console.log('HELLO');
  			var x = document.getElementById("table").getElementsByTagName("td");
    		x[0].style.backgroundColor = "yellow";  
    	}*/
  	}
}