let io = require('socket.io');
let express = require('express');
let app = express();
let client = io();
import { invite } from './invitation';
import { gameSocket } from './gameSocket';
import { chat } from './chat';

app.io = client;



// client.on('connection', function(socket) {

// 	socket.on('inputBulletPos', insertBulletPos);

// 	function insertBulletPos(data){

//         client.emit('outputBulletPos', {
// 			x: data.posX,
// 			y: data.posY,
//         	power: data.power,
//         	angleWeapon: data.angle,
// 			tankAngle: data.tankAngle
//         });

// 	}

// 	socket.on('initPosTank', function(data) {
// 		client.emit('initOutPosTank', {
// 			tank1: data.tank1,
// 			tank2: data.tank2,
//             tankImage: data.tankImage,
//             weaponImage: data.weaponImage,
// 			weaponAngle: data.weaponAngle
// 		});
// 	});
// });

// client.on('connection', function(socket) {
// 	socket.on('inputPosTank', insertData2);

// 	function insertData2(data){

//         client.emit('outputPosTank', {
//         	x: data.posX,
//         	y: data.posY,
// 			tankImage: data.tankImage,
// 			weaponImage: data.weaponImage,
// 			weaponAngle: data.weaponAngle
//         });
// 	}

// 	socket.on('moveIdServer', (data) => {
// 		client.emit('moveIdClient', { playerId: data.playerId });
// 	});
// });

invite(client);
gameSocket(client);
chat(client);

module.exports = app;
