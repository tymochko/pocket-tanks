var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var usersCollection = require('./usersController');
var usersImages = require('./../../usersImages.json');
var multer = require('multer');

// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    usersCollection.showAll((err, users) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.json({'users': users, 'sessionId': req.session.user});
        }
    });
});

// get user's info by id, for instance in profile page
router.get('/profile', (req, res) => {
    usersCollection.showProfile({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.send(foundUser);
        }
    });
});

// log in user
router.post('/login', (req, res) => {
    var loginName = req.body.userName;
    var loginPassword = req.body.userPassword;

    usersCollection.loginUser(loginName, loginPassword, (err, foundUser) => {
        console.log('foundUser ', foundUser);
        if (err) {
            console.log('err  ', err);
            return res.status(401).send();
        } else {
            req.session.user = foundUser._id;
            req.session.username = foundUser.userName;
            res.status(200).send();
        }
    });
});

// log out user
router.post('/logout', (req, res) => {
    usersCollection.logoutUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            // req.session.destroy(function(){
            //     res.redirect('/');
            // });
            res.status(204).send(foundUser);
        }
    });
});

// add newUser
router.post('/add', (req, res) => {
    var newUser = new usersCollection();

    newUser.userName = req.body.userName;
    newUser.userAge = req.body.userAge;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;
    newUser.userImg = usersImages[0];
    newUser.isOnline = false;
    newUser.isEnabled = true;

    usersCollection.createUser(newUser ,function(err, user) {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({'message': 'This user is already'});
        } else {
            let dir = './public/usersInfo/' + user._id;
            fs.mkdirSync(dir);
            req.session.user = user._id;
            req.session.username = user.userName;
            res.status(201);
            res.json({'message': 'User registered'});
        }
    });
});

// edit user profile
router.put('/profile/updateUser', (req, res) => {
    usersCollection.updateUser({_id: req.session.user}, req.body, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.status(204).send(foundUser);
        }
    });
});

// delete user
router.put('/profile/delete', (req, res) => {
    usersCollection.deleteUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            res.status(204).send(foundUser);
        }
    });
});

//upload user img
router.post('/profile/upload', function (reqvest, res) {
    var d = new Date();
    let fileNameNew = 'userAvatar' + d.getTime();
    var dir = './public/usersInfo/' + reqvest.session.user;
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {


            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, fileNameNew + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });
;
    let upload = multer({ //multer settings
        storage: storage
    }).single('file');

    upload(reqvest, res, function (err) {
        if (err) {

            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({image:dir+'/'+fileNameNew + '.png',description: 'new1'});

    });
});


module.exports = router;