var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var usersCollection = require('./usersController');

// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    usersCollection.showAll((err, users) => {
        if (err) {
            res.status(401).send();
        }

        res.json({'users': users, 'sessionId': req.session.user});
    });
});

// get user's info by id, for instance in profile page
router.get('/profile', (req, res) => {
    usersCollection.showProfile({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            res.status(401).send();
        }
        
        res.send(foundUser);
    });
});

// log in user
router.post('/login', (req, res) => {
    var loginName = req.body.userName;
    var loginPassword = req.body.userPassword;

    usersCollection.loginUser(loginName, loginPassword, (err, user) => {
        if (err) {
            res.status(401).send();
        } else {
            req.session.user = user._id;
            req.session.username = user.userName;
            res.status(200).send();
        }
    });
});

// log out user
router.post('/logout', (req, res) => {
    usersCollection.logoutUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            res.status(401).send();
        }

        res.status(204).send(foundUser);
    });
});

// add newUser
router.post('/add', (req, res) => {
    var newUser = new usersCollection();

    newUser.userName = req.body.userName;
    newUser.userAge = req.body.userAge;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;
    newUser.userAge = req.body.userAge;
    newUser.isOnline = false;
    newUser.isEnabled = true;

    usersCollection.createUser(newUser ,function(err, user) {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({'message': 'This user is already'});
        } else {
            req.session.user = user._id;
            req.session.username = user.userName;
            res.status(201);
            res.json({'message': 'User registered'});
        }
    });
});

// edit user profile
router.put('/profile/updateUser', (req, res) => {
    // console.log('req.body ', req.body);
    usersCollection.updateUser({_id: req.session.user}, req.body, (err, foundUser) => {
        // console.log('this  ', this);
        if (err) {
            res.status(401).send();
        }
        console.log('Route ', foundUser);
        res.status(204).send(foundUser);
    });
});

// // edit userPassword
// router.put('/profile/updatePassword', (req, res) => {
//     usersCollection.updatePassword({_id: req.session.user}, (err, foundUser) => {
//         if (err) {
//             res.status(401).send();
//         }
//
//         res.status(204).send(foundUser);
//     });
// });

// delete user
router.put('/profile/delete', (req, res) => {
    usersCollection.deleteUser({_id: req.session.user}, (err, foundUser) => {
        if (err) {
            res.status(401).send();
        }

        console.log('foundUser ', foundUser);
        res.status(204).send(foundUser);
    });
});

module.exports = router;