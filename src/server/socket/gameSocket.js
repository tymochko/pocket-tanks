import GameData from '../api/game/gameController';

let tanksCoords = {};

export function gameSocket(client) {
    client.on('connection', function(socket) {

        socket.on('inputBulletPos', insertBulletPos);

        function insertBulletPos(data) {

            client.emit('outputBulletPos', {
                x: data.posX,
                y: data.posY,
                power: data.power,
                angleWeapon: data.angle,
                tankAngle: data.tankAngle
            });
        }

        socket.on('changeCoords', (data) => {
            if (tanksCoords.tank1.id === data.tank.id) {
                tanksCoords.tank1.tankX = data.tank.tankX;
                tanksCoords.tank1.tankY = data.tank.tankY;
            } else {
                tanksCoords.tank2.tankX = data.tank.tankX;
                tanksCoords.tank2.tankY = data.tank.tankY;
            }
            client.emit('sendCoordsOnClient', { tank: data.tank });
        });

        socket.on('initPosTank', function(data) {
            if (!Object.keys(tanksCoords).length) {
                tanksCoords = {
                    tank1: {
                        id: data.tank1.id,
                        tankX: data.tank1.tankX,
                        tankY: data.tank1.tankY,
                        weaponAngle: data.tank1.weaponAngle
                    },
                    tank2: {
                        id: data.tank2.id,
                        tankX: data.tank2.tankX,
                        tankY: data.tank2.tankY,
                        weaponAngle: data.tank2.weaponAngle
                    }
                };
            }
            client.emit('initOutPosTank', {
                tank1: tanksCoords.tank1,
                tank2: tanksCoords.tank2
            });
        });

        socket.on('inputPosTank', insertData2);

        function insertData2(data) {

            client.emit('outputPosTank', {
                direction: data.direction,
                tankMoves: data.tankMoves,
                tank1: data.tank1,
                tank2: data.tank2
            });
        }

        socket.on('inputPosWeapon', (data) => {
            client.emit('outputPosWeapon', {
                weaponMoves: data.weaponMoves,
                angle: data.angle,
                tank1: data.tank1,
                tank2: data.tank2
            });
        });

        socket.on('moveIdServer', (data) => {
            client.emit('moveIdClient', { playerId: data.playerId });
        });

        socket.once('end-game', (gameData) => {
            GameData.updateGameInfo(gameData.id, gameData, (err, game) => {
                if (err) {
                    throw err;
                } else {
                    client.emit('redirect-away-from-game', {});
                }
            });
        });
    });
}
