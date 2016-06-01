const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/users');

const app = express();
const config = require('./config');

app.use(express.static(__dirname + '/public'));

// connect to users database
mongoose.connect('localhost:27017/users');

/* GET home page. */
app.get('/', (req, res) => {
    console.log('hello console');
    res.send('hello browser');
});

app.get('/users', (req, res) => {
    console.log('getting all the users');
    User.find((err, users) => {
        if (err) {
            res.send(err);
        }

        res.send(users)
    });
});

app.listen(config.port, () => {
    console.log('Server listening on: http://localhost:%s', config.port);
});