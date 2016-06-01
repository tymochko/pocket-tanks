'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var app = express();
var config = require('./config');

app.use(express.static(__dirname + '/public'));

// connect to users database
mongoose.connect('localhost:27017/users');

mongoose.model('users', { name: String });

app.listen(config.port, function () {
    console.log('Server listening on: http://localhost:%s', config.port);
});