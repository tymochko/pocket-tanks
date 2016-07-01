var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// remove after MongoStore is removed from app.js
var mongoose = require('mongoose');

var users = require('./api/users/usersRoutes');
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var app = express();

var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'come_in',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 45 * 60 * 1000 },
    saveUninitialized: false,
    resave: true,
    rolling: true
}));

app.use('/api/users', users);

//=======
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/*', express.static(path.join(__dirname, '..', '..', 'public')));

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

 var mongo = require('mongodb').MongoClient;
 var io = require('socket.io');
 
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
                    sendStatus('Name and Message Required');
                }
                else
                {
                    col.insert({name: name,message:message,time:time}, function(){
 
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
