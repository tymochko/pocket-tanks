var io = require('socket.io');
var express=require('express');
var app=express();
var client=io();
var mongoose = require('mongoose');
const messageLimit=5;

app.io=client;

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
						sender_username: info.username						
					});
				}
			});
		});
		socket.on('accepted', (data) => {
			connections.forEach(function(other) {
				if (other.user == data.invitor) {
					other.socket.emit('invite-accepted', {
						other_user: info.user
					});
				}
			});
		});
		socket.on('rejected', (data) => {
			connections.forEach(function(other) {
				if (other.user == data.invitor) {
					other.socket.emit('invite-rejected', {
						other_user: info.user
					});
				}
			});
		});
	});
});

module.exports = app;
