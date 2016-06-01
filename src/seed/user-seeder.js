var User = require('../models/users');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/users');

var users = [
    new User({
        userName: 'John',
        userEmail: 'john@example.com',
        userPassword: 'password123'
    }),
    new User({
        userName: 'Anna',
        userEmail: 'anna@example.com',
        userPassword: 'qwerty123'
    }),
    new User({
        userName: 'Emmy',
        userEmail: 'emmy@example.com',
        userPassword: '1q2w3e4r'
    })
];

var done = 0;
for (var i = 0; i < users.length; i++) {
    users[i].save(function (err, result) {
        done++;
        if (done === users.length) {
            exit();
        }
    });
};

function exit() {
    mongoose.disconnect();
};
