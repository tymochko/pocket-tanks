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

            const deferred = $q.defer();

            socket.on('get-game-data', (gameData) => {
                deferred.resolve(gameData);
            });

            socket.emit('enter-with-gameId', gameId);

            return deferred.promise;
        },

        finish($uibModal, win) {
            const modalInstance = $uibModal.open({
                templateUrl: 'game/gameFinishedWindow.html',
                controller: 'gameFinishedCtrl',
                resolve: {
                    win: () => {
                        return win;
                    }
                }
            });
        }

    };
}
