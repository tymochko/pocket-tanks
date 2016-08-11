import GameData from '../api/game/gameController';

export function gameSocket(client) {
    client.on('connection', function(socket) {

        socket.on('end-game', (gameData) => {
            GameData.updateGameInfo(gameData.id, gameData, (err, game) => {
                if (err) {
                    throw err;
                } else {
                    socket.emit('redirect-away-from-game', {});
                }
            });
        });
    });
}
