var io = require('socket.io');
var express = require('express');
var app = express();
var client = io();
var mongoose = require('mongoose');
const messageLimit = 5;
const GameData = require('../server/api/game/gameController');

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
(function(){
client.on('connection', function(socket){
	socket.on('inputPos', insertData2);

	function insertData2(data){
		console.log(data);

        client.emit('outputPos',{
        	x: data.posX,
        	y: data.posY,
        	power: data.power,
        	angleWeapon: data.angle,
			tankAngle: data.tankAngle,
        	deltaT: data.deltaT
        });
	}

	socket.on('initPosTank', function(data){
		client.emit('initOutPosTank', {
			x: data.tankX,
			y: data.tankY,
            tankImage: data.tankImage,
            weaponImage: data.weaponImage,
			weaponAngle: data.weaponAngle
		});
	});
});
}).call(this);

(function(){
client.on('connection', function(socket){
	socket.on('inputPosTank', insertData2);

	function insertData2(data){

        client.emit('outputPosTank',{
        	x: data.posX,
        	y: data.posY,
			tankImage: data.tankImage,
			weaponImage: data.weaponImage,
			weaponAngle: data.weaponAngle
        });
	}
});
}).call(this);

// <----------Invitation part ------------>

var connections = [];

client.on('connection', function(socket) {

	var info = {socket: socket, user: null, username: null};

	connections.push(info);

	socket.once('auth', function(data) {
		info.user = data.user;
		info.username = data.username;

		socket.on('invite', (data) => {
			connections.forEach(function(other) {
				if (other.user == data.target_user) {
					other.socket.emit('you-are-invited', {
						sender_user: info.user,
						sender_username: info.username,
                        target_user: data.target_user
					});
				}
			});
		});
		socket.on('accepted', (data) => {
			connections.forEach(function(other) {
				if (other.user === data.invitor) {
                    socket.emit('fetch-users-ids', {
                        player1: info.user,
                        player2: data.invitor
                    });
					// other.socket.emit('invite-accepted', {
					// 	other_user: info.user
					// });
				}
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

        socket.on('start-game', (usersIds) => {
            const initGameData = {
                player1: {
                    player1Id: usersIds.player1,
                    tankX: 150,
                    tankY: 200,
                    bulletX: 0,
                    bulletY: 0,
                    weaponX: 100,
                    weaponY: 100,
                    angle: 0.17,
                    weaponAngle: 0.34
                },
                player2: {
                    player2Id: usersIds.player2,
                    tankX: 450,
                    tankY: 400,
                    bulletX: 0,
                    bulletY: 0,
                    weaponX: 300,
                    weaponY: 300,
                    angle: 0.17,
                    weaponAngle: 0.34
                },
                originalPoints: [
                    [0, 280], [200, 350], [350, 150], [500, 250], [700, 150], [800, 250], [800, 500], [0, 500], [0, 280]
                ]
            };

            const newGame = new GameData();
            newGame.player1 = initGameData.player1;
            newGame.player2 = initGameData.player2;
            newGame.originalPoints = data.originalPoints;

            GameData.createGame(newGame, function(err, game) {
                if (err) {
                    console.log(err);
                } else {
                    socket.emit('game-created', game);
                }
            });
        });
	});
});

module.exports = app;
