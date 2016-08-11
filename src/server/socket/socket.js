var io = require('socket.io');
var express = require('express');
var app = express();
var client = io();
var mongoose = require('mongoose');
const messageLimit = 5;
import { invite } from './invitation';
import { gameSocket } from './gameSocket';

app.io = client;

client.on('connection', function(socket) {
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

client.on('connection', function(socket) {

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

	socket.on('initPosTank', function(data) {
		console.log(data.tank1.setWeaponAngle);
		client.emit('initOutPosTank', {
			tank1: data.tank1,
			tank2: data.tank2,
            tankImage: data.tankImage,
            weaponImage: data.weaponImage,
			weaponAngle: data.weaponAngle
		});
	});
});

client.on('connection', function(socket) {
	socket.on('inputPosTank', insertData2);

	function insertData2(data){

        client.emit('outputPosTank', {
        	x: data.posX,
        	y: data.posY,
			tankImage: data.tankImage,
			weaponImage: data.weaponImage,
			weaponAngle: data.weaponAngle
        });
	}

	socket.on('moveIdServer', (data) => {
		client.emit('moveIdClient', { playerId: data.playerId });
	});
});

invite(client);
gameSocket(client);

module.exports = app;
