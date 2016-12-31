export class Scores {
	constructor($scope, $http) {
    const allgames = [];

    $http.get('api/users/allGames').then(function(response) {
        const games = response.data.games;

        games.forEach(function(item) {
          const player1 = {};
          const player2 = {};

          player1.id = item.player1.id;
          player1.lose = item.player1.lose;
          player1.win = item.player1.win;
          player2.id = item.player2.id;
          player2.lose = item.player2.lose;
          player2.win = item.player2.win;

          allgames.push(player1);
          allgames.push(player2);
        });
    });

	$http.get('api/users').then(function(response) {
        const users = response.data.users;
        const userlist = [];

		users.forEach(function(item) {
			const myuser = { };
			myuser.id = item._id;
			myuser.name = item.userName;
			myuser.lose = 0;
			myuser.win = 0;

			userlist.push(myuser);
		});

		allgames.forEach(function(gameitem) {
			userlist.forEach(function(useritem) {
				if (useritem.id === gameitem.id) {
					useritem.lose += gameitem.lose;
					useritem.win += gameitem.win;
				}
			});
		});

		$scope.userlist = userlist;
	});

	$scope.sortType = 'name'; // default sort type
	$scope.sortReverse = false; // default sort order
	$scope.searchScore = ''; // default search/filter term
	}
}
