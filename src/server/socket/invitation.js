import GameData from '../api/game/gameController';

var connections = [];

export function invite(client) {
    client.on('connection', function(socket) {

        var info = {socket, user: null, username: null};

        connections.push(info);

        socket.once('auth', function(data) {
            info.user = data.user;
            info.username = data.username;

            socket.on('invite', (usersIds) => {
                connections.forEach(function(other) {
                    if (other.user === usersIds.targetUser) {
                        other.socket.emit('you-are-invited', {
                            senderUser: info.user,
                            senderUsername: info.username,
                            targetUser: usersIds.targetUser
                        });
                    }
                });
            });

            socket.on('accepted', (usersIds) => {
                socket.emit('fetch-users-ids', {
                    player1: usersIds.invitor,
                    player2: usersIds.invited
                });
            });

            socket.on('rejected', () => {
                connections.forEach(function(other) {
                    if (other.user === data.invitor) {
                        other.socket.emit('invite-rejected', {
                            otherUser: info.user
                        });
                    }
                });
            });

            socket.on('create-game', (usersIds) => {
                const initGameData = {
                    player1: {
                        id: usersIds.player1
                    },
                    player2: {
                        id: usersIds.player2
                    },
                    originalPoints: [
                        [0, 280], [200, 350], [350, 150], [500, 250], [700, 150], [800, 250], [800, 500], [0, 500], [0, 280]
                    ]
                };

                const newGame = new GameData();
                newGame.player1 = initGameData.player1;
                newGame.player2 = initGameData.player2;
                newGame.originalPoints = initGameData.originalPoints;

                GameData.createGame(newGame, function(err, game) {
                    if (err) {
                        throw err;
                    } else {
                        connections.forEach(function(other) {
                            if (other.user === usersIds.player1) {
                                other.socket.emit('start-game', {gameId: game._id, playerId: usersIds.player1});
                            }
                        });

                        socket.emit('start-game', {gameId: game._id, playerId: usersIds.player2});
                    }
                });
            });
        });

        socket.on('enter-with-gameId', (gameId) => {
            GameData.findGame({_id: gameId}, (err, foundGame) => {
                if (err) {
                    throw err;
                } else {
                    socket.emit('get-game-data', foundGame);
                }
            });
        });

        // unused
        socket.on('transfer-data', (gameData) => {
            gameData.updateGameInfo(gameData.id, gameData, (err, foundGame) => {
                console.log(foundGame);
            });
        });
    });
}
