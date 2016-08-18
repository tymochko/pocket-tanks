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

    $http.get('api/users/allGames').then(function(response){
        var games = response.data.games,
        	mygames = [];

    		games.forEach(function(item, index){
    			var myobj1 = {};
    			var myobj2 = {};
    			myobj1.name = item.player1.id;
    			myobj2.name = item.player2.id;
    			if(item.player1.life == 0) {
    				myobj1.lose = 1;
    				myobj1.win = 0;
    				myobj2.lose = 0;
    				myobj2.win = 1;
    			}
    			if(item.player2.life == 0) {
    				myobj2.lose = 1;
    				myobj2.win = 0;
    				myobj1.lose = 0;
    				myobj1.win = 1;
    			}
    			mygames.push(myobj1);
    			mygames.push(myobj2);
    		})

    	console.log(mygames);

          
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