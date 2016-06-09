var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// require mongoose dep - MongoDB Object modeling
const mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var game = require('./routes/game');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');

var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// connect to user database
mongoose.connect('localhost:27017/users');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/game', game);

// started to work on chat

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;
 
    mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
        if(err) throw err;
 
          client.on('connection',function(socket){
 
            var col = db.collection('messages'),
                sendStatus = function(s){
                  socket.emit('status',s);
                };
 
                col.find().sort({$natural: -1 }).limit(5).toArray(function(err,res){
                    if(err) throw err;
                    socket.emit('output',res);
                });
                col.find().sort({$natural: 1 });
 
            //wait for input
            socket.on('input', function(data){
                var name = data.name;
                var message = data.message;
                var time=data.time;
 
                whitespace = /^\s*$/;
 
                if(whitespace.test(name) || whitespace.test(message))
                {
                    sendStatus('Name and Message Required');
                }
                else
                {
                    col.insert({name: name,message:message,time:time}, function(){
 
                        //emit latest messages to all clients
                        client.emit('output',[data]);
 
                        sendStatus({
                            message:"Message sent",
                            clear:true
                        });
                    });
                }
 
            });
         });
    });
module.exports = app;
