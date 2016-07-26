export function gameService ($http) {
    let gameData = {};

    console.log($http, '$http');

    return function (msg) {
        gameData = msg;

        console.log(gameData, 'gameData');
        return $http.post('api/users/startGame', gameData);
    };
            // return $http({
            //     method: 'POST',
            //     url: 'api/users/startGame'
            // }, msg).then(function successCallback(response) {
            //     console.log(response.data, 'response.data');
            //     console.log('success');
            //     // this callback will be called asynchronously
            //     // when the response is available
            // }, function errorCallback(response) {
            //     console.log(response.data, 'response.data');
            //     console.log('error');
            //     // called asynchronously if an error occurs
            //     // or server returns response with an error status.
            // });
        // },
        //
        // getGameData: function (msg) {
        //     gameData = msg;
        //     console.log(gameData, 'gameData');
        // },
        //
        // putGameData: function (paramX) {
        //     return initGame(paramX);
        // }
}