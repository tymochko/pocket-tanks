export class Scores {
	constructor($scope, $http, $translate) {
    var allgames = [];

    $http.get('api/users/allGames').then(function(response){
        var games = response.data.games;

        games.forEach(function(item, index){
          var player1 = {};
          var player2 = {};

          player1.id = item.player1.id;
          player1.lose = item.player1.lose;
          player1.win = item.player1.win;
          player2.id = item.player2.id;
          player2.lose = item.player2.lose;
          player2.win = item.player2.win;

          allgames.push(player1);
          allgames.push(player2);
        })
    })

		$http.get('api/users').then(function(response){
        var users = response.data.users,
            userlist = [];

    		users.forEach(function(item, index){
    			var myuser = { };
          myuser.id = item._id
    			myuser.name = item.userName;
          myuser.lose = 0;
          myuser.win = 0;
    			userlist.push(myuser);
    		})

        allgames.forEach(function(gameitem, gameindex){
          userlist.forEach(function(useritem, userindex){
            if(useritem.id == gameitem.id){
              useritem.lose += gameitem.lose;
              useritem.win += gameitem.win;
            }
          })
        })
    		$scope.userlist = userlist;
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