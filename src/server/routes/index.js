var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('mongoose').model('usersCollection');

/* GET home page. */
router.get('/', function(req, res, next) {
    var user = new User({
        userName: 'andrew_534',
        userEmail: 'andrew@gmail.com',
        userPassword: '222',
        isOnline: false
    });

    user.save(function(err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data );
    });

    res.sendfile(path.resolve('src/client/index.html'));
});

router.get('/dashboard', function(req, res, next) {

    User.find({}, function(err, users) {
        if (err) console.log(err);
        else res.json(users);
        console.log(users);
    });
    // var users = [
    //     {
    //         userName: 'taras_242',
    //         userEmail: 'taras@gmail.com',
    //         userPassword: '2222',
    //         isOnline: true
    //     },
    //     {
    //         userName: 'ivan_22',
    //         userEmail: 'ivan@gmail.com',
    //         userPassword: '1111',
    //         isOnline: false
    //     },
    //     {
    //         userName: 'oles_22',
    //         userEmail: 'oles@gmail.com',
    //         userPassword: '3333',
    //         isOnline: true
    //     }
    // ];
    // res.json(users);
});

module.exports = router;
