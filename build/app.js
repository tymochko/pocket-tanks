'use strict';

var express = require('express');
var app = express();
var config = require('./config');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('Hello world');
});

app.listen(config.port, function () {
  console.log('Server listening on: http://localhost:%s', config.port);
});