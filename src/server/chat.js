var io = require('socket.io');
var express = require('express');
var app = express();
var client = io();
var mongoose = require('mongoose');
const messageLimit = 5;
const GameData = require('../server/api/game/gameController');
import { findGame } from '../server/api/game/gameController';

app.io = client;

client.on('connection',function(socket){
	var col = mongoose.connection.db.collection('messages');

	(col.find().sort({$natural: -1 }).limit(messageLimit)).toArray(function(err,res){
	    if(err)
	    	throw err;
	    socket.emit('output',res);
	});

	socket.on('input', insertData);

	function insertData(data){
		var name = data.name;
	    var message = data.message;
	    var time=data.time;

	    whitespace = /^\s*$/;

	    if(!whitespace.test(name) || !whitespace.test(message))
	    {
	        col.insert({name: name,message:message,time:time}, function(){
	            client.emit('output',[data]);
	        });
	    }
	}

});
let tanksCoords = {};
client.on('connection', function(socket){

	socket.on('inputBulletPos', insertBulletPos);

	function insertBulletPos(data){

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
		console.log(tanksCoords);
		if (!Object.keys(tanksCoords).length) {
			tanksCoords = {
				tank1: {
					id: data.tank1.id,
					tankX: data.tank1.tankX,
					tankY: data.tank1.tankY
				},
				tank2: {
					id: data.tank2.id,
					tankX: data.tank2.tankX,
					tankY: data.tank2.tankY
				}
			};
		}
		client.emit('initOutPosTank', {
			tank1: tanksCoords.tank1,
			tank2: tanksCoords.tank2
		});
	});
});

client.on('connection', function(socket) {
	socket.on('inputPosTank', insertData2);

	function insertData2(data) {

        client.emit('outputPosTank', {
			direction: data.direction,
			tankMoves: data.tankMoves,
        	tank1: data.tank1,
        	tank2: data.tank2
        });
	}

	socket.on('moveIdServer', (data) => {
		client.emit('moveIdClient', { playerId: data.playerId });
	});
});

// <----------Invitation part ------------>

var connections = [];

client.on('connection', function(socket) {

	var info = {socket: socket, user: null, username: null};

	connections.push(info);

	socket.once('auth', function(data) {
		info.user = data.user;
		info.username = data.username;

		socket.on('invite', (usersIds) => {
			connections.forEach(function(other) {
                if (other.user === usersIds.target_user) {
                    console.log(other.user, 'other.user TARGET');
                    other.socket.emit('you-are-invited', {
                        sender_user: info.user,
                        sender_username: info.username,
                        target_user: usersIds.target_user
                    });
                }
            });
		});

		socket.on('accepted', (data) => {
			tanksCoords = {};
			socket.emit('fetch-users-ids', {
                player1: data.invitor,
                player2: info.user
            });
		});

		socket.on('rejected', (data) => {
			connections.forEach(function(other) {
				if (other.user === data.invitor) {
					other.socket.emit('invite-rejected', {
						other_user: info.user
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
                    console.log(err);
                } else {
                    connections.forEach(function(other) {
                        if (other.user === usersIds.player1) {
                            other.socket.emit('game-create-player1', {gameId: game._id, player1id: usersIds.player1});
                        }
                    });

                    socket.emit('game-create-player2', {gameId: game._id, player2id: usersIds.player2});
                }
            });
        });
	});

    socket.on('enter-with-gameId', (gameId) => {
        GameData.findGame({_id: gameId}, (err, foundGame) => {
            if (err) {
                console.log('err ', err);
                throw err;
            } else {
                socket.emit('get-game-data', foundGame);
            }
        });
    });
	socket.on('transfer-data', (gameData) => {
		gameData.updateGameInfo(gameData.id, gameData, (err, foundGame) =>{
			console.log(foundGame);
		});
	});
});

module.exports = app;
