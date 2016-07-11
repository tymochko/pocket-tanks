//var app=require('../app');
var mongo = require('mongodb').MongoClient;
 var io = require('socket.io');
 var express=require('express');
 var app=express();
 var client=io();
 app.io=client;
 
 
    mongo.connect('mongodb://localhost/users', function(err,db){
 
        if(err) throw err;
 
            client.on('connection',function(socket){
 
            var col = db.collection('messages'),
                sendStatus = function(s){
                    socket.emit('status',s);
                };
 
                (col.find().sort({$natural: -1 }).limit(5)).toArray(function(err,res){
                    if(err) throw err;
                    socket.emit('output',res);
                });
 
 
            socket.on('input', function(data){
                var name = data.name;
                var message = data.message;
                var time=data.time;
 
                whitespace = /^\s*$/;
 
                if(whitespace.test(name) || whitespace.test(message))
                {
                   // sendStatus('Name and Message Required');
                }
                else
                {
                    col.insert({name: name,message:message,time:time}, function(){
 
                        client.emit('output',[data]);
 
                        // sendStatus({
                        //     message:"Message sent",
                        //     clear:true
                        // });
                    });
                }
 
            });
         });
    });

module.exports = app;