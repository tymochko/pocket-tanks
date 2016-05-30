const express = require('express');
const app = express();
const config = require('./config');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('Hello world')
});

app.listen(config.port, () => {
  console.log('Server listening on: http://localhost:%s', config.port);
});