export function gameService ($http) {
    let gameData = {};

    // return {
    //     getGameData: (msg) => {
    //         gameData = msg;
    //         console.log(gameData, 'gameData');
    //     },
    //
    //     putGameData: (paramX) => {
    //         return initGame(paramX);
    //     }

    return function (msg) {
        gameData = msg;

        $http({
            method: 'GET',
            url: 'api/users/profile'
        }).then(function successCallback(response) {
            console.log(response.data, 'response.data');
            console.log('success');
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response.data, 'response.data');
            console.log('error');
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
}
