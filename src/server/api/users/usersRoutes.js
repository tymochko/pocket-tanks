const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const usersCollection = require('./usersController');
const fsHelper = require('../libs/fsHelper');
const multer = require('multer');
const gameData = require('../game/gameController');

const userScopeName = 'userAvatar';
const publicScopeName = 'public';
const userUploadsScopeName = 'userUploads';
const publicImgURL = "/api/users/profile/getImage/" + publicScopeName + '/';
const userImgURL = '/api/users/profile/getImage/' + userUploadsScopeName + '/';
const userInfoDir = './src/server/static/usersInfo/';


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
            const userInfoDTO = {
                userName: foundUser.userName,
                userAge: foundUser.userAge,
                userEmail: foundUser.userEmail,
                userLanguage:foundUser.userLanguage
            };
            res.send(userInfoDTO);
        }
    });
});

// log in user
router.post('/login', (req, res) => {
    const loginName = req.body.userName;
    const loginPassword = req.body.userPassword;

    usersCollection.loginUser(loginName, loginPassword, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            return res.status(401).send();
        } else {
            req.session.user = foundUser._id;
            req.session.username = foundUser.userName;
            res.status(200).json({
                user: foundUser._id,
                username: foundUser.userName
            }).send();
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
            req.session.destroy();
            res.status(200).json({'status': 'success'});
        }
    });
});

//check session
router.get('/checkSession', (req, res) => {
    usersCollection.checkUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            res.status(401).send();
        } else if (foundUser != null) {
            res.status(200).json({'status': 'success'});
        } else {
            res.status(200).json({'status': 'error'});
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
    newUser.isOnline = false;
    newUser.isEnabled = true;
    newUser.userLanguage = 'eng';

    usersCollection.createUser(newUser, function (err, user) {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({'message': 'This user is already'});
        } else {
            fsHelper.checkDir(userInfoDir);
            fsHelper.checkDir(userInfoDir + user._id);
            console.log(newUser.userEmail);
            usersCollection.handleEmail(newUser.userName, newUser.userEmail);
            req.session.user = user._id;
            req.session.username = user.userName;
            res.status(201);
            res.json({'message': 'User registered'});
        }
    });
});

// edit user profile
router.put('/profile/updateUser', (req, res) => {
    const isUserImgPresent = req.body.userImg && req.body.userImg.image;
    if (isUserImgPresent) {
        req.body.userImg.image = req.body.userImg.image.split("/").pop().split('?').shift();
    }

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
            req.session.destroy();
            res.status(204).send(foundUser);
        }
    });
});

//upload user img
router.post('/profile/upload', function (request, res) {
    try {

        usersCollection.uploadImg(request, res);

    }
    catch (e) {
        console.log(e);
    }

});

router.get('/profile/getImage/:scope/:imageName?', function (req, res) {
    try {
        var scope = req.params.scope;
        switch (scope) {
            case publicScopeName:
                usersCollection.getPublicImage(req, res);
                break;
            case userScopeName:
                usersCollection.getUserImage(req, res);
                break;
            case userUploadsScopeName:
                usersCollection.getUserUploadedImage(req, res);
                break;
        }
    }
    catch (e) {
        console.log(e)
    }
});

router.get('/profile/publicImages', (req, res) => {
    try {
        usersCollection.getPublicImg(req, res);
    }
    catch (e) {
        console.log(e);
    }
});

//Don't touch with hands
router.post('/startGame', (req, res) => {
    console.log(req.data, 'req.data');
    //req.data.sender_user = user._id;
    //req.data.sender_username = user.userName;
    // start data at start
    var data = {
            player1: {
                tankX: 150,
                tankY: 200,
                bulletX: 0,
                bulletY: 0,
                weaponX: 100,
                weaponY: 100,
                angle: 0.17,
                weaponAngle: 0.34
            },
            player2: {
                tankX: 450,
                tankY: 400,
                bulletX: 0,
                bulletY: 0,
                weaponX: 300,
                weaponY: 300,
                angle: 0.17,
                weaponAngle: 0.34
            },
            originalPoints: [
                [0, 280], [200, 350], [350, 150], [500, 250], [700, 150], [800, 250], [800, 500], [0, 500], [0, 280]
            ]
        };

    var newGame = new gameData();
    newGame.player1 = data.player1;
    newGame.player2 = data.player2;

    newGame.originalPoints = data.originalPoints;

    gameData.createGame(newGame, function (err, game) {
        if (err) {
            console.log(err);
            res.status(400).send();

        }
        else {
            res.status(200).send(game);
        }
    });
});

module.exports = router;
