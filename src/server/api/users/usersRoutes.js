import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import UsersCollection from './usersController';
import fsHelper from '../libs/fsHelper';

const userScopeName = 'userAvatar';
const publicScopeName = 'public';
const userUploadsScopeName = 'userUploads';
const userInfoDir = './src/server/static/usersInfo/';

export const router = express.Router();

// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    UsersCollection.showAll((err, users) => {
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
    UsersCollection.showProfile({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            console.log('err  ', err);
            res.status(401).send();
        } else {
            const userInfoDTO = {
                userName: foundUser.userName,
                userAge: foundUser.userAge,
                userEmail: foundUser.userEmail,
                activeGame:foundUser.activeGame,
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

    UsersCollection.loginUser(loginName, loginPassword, (err, foundUser) => {
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
    UsersCollection.logoutUser({_id: req.session.user}, (err, foundUser) => {
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
    UsersCollection.checkUser({_id: req.session.user}, (err, foundUser) => {
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
    const newUser = new UsersCollection();

    newUser.userName = req.body.userName;
    newUser.userAge = req.body.userAge;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;
    newUser.isOnline = false;
    newUser.isEnabled = true;
    newUser.activeGame = null;
    newUser.userLanguage = 'eng';

    UsersCollection.createUser(newUser, (err, user) => {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({message: 'This user is already'});
        } else {
            fsHelper.checkDir(userInfoDir);
            fsHelper.checkDir(userInfoDir + user._id);
            UsersCollection.handleEmail(newUser.userName, newUser.userEmail);
            res.status(201);
            res.json({message: 'User registered'});
        }
    });
});

// edit user profile
router.put('/profile/updateUser', (req, res) => {
    const isUserImgPresent = req.body.userImg && req.body.userImg.image;
    if (isUserImgPresent) {
        req.body.userImg.image = req.body.userImg.image.split("/").pop().split('?').shift();
    }

    UsersCollection.updateUser({_id: req.session.user}, req.body, (err, foundUser) => {
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
    UsersCollection.deleteUser({_id: req.session.user}, (err, foundUser) => {
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

        UsersCollection.uploadImg(request, res);

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
                UsersCollection.getPublicImage(req, res);
                break;
            case userScopeName:
                UsersCollection.getUserImage(req, res);
                break;
            case userUploadsScopeName:
                UsersCollection.getUserUploadedImage(req, res);
                break;
        }
    }
    catch (e) {
        console.log(e)
    }
});

router.get('/profile/publicImages', (req, res) => {
    try {
        UsersCollection.getPublicImg(req, res);
    }
    catch (e) {
        console.log(e);
    }
});

module.exports = router;
