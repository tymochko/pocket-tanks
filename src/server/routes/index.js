var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('mongoose').model('usersCollection');

/* GET home page. */
router.get('/', function(req, res, next) {
    // var user = new User({
    //     userName: 'andrew_534',
    //     userEmail: 'andrew@gmail.com',
    //     userPassword: '222',
    //     isOnline: false
    // });

    // user.save(function(err, data) {
    //     if (err) console.log(err);
    //     else console.log('Saved : ', data );
    // });

    res.sendfile(path.resolve('src/client/index.html'));
});

router.get('/dashboard', function(req, res, next) {

    User.find({}, function(err, users) {
        if (err) console.log(err);
        else res.json(users);
        // console.log(users);
    });

});

module.exports = router;
