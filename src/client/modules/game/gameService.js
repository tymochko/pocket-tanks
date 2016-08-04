export function gameService() {

    return {
        getUsersIds(socket, $q) {
            const deferred = $q.defer();

            socket.once('fetch-users-ids', (usersIds) => {
                deferred.resolve(usersIds);
            });
            return deferred.promise;
        },

        getInitGameData(socket, $q, gameId) {
            socket.emit('enter-with-gameId', gameId);

            const deferred = $q.defer();
            
            socket.on('get-game-data', (gameData) => {
                deferred.resolve(gameData);
            });
            
            return deferred.promise;
        }
    };
}
