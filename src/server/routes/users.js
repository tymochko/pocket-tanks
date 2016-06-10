var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const usersCollection = require('../models/users');

/* GET users listing. */

/* TODO

6) password requirements
7) log out - change online status

*/

// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    usersCollection.find((err, users) => {
        res.send(users);
    });
});

// get user's info by id, for instance in profile page
router.get('/:id', (req, res) => {
    var id = req.params.id;
    usersCollection.findOne({_id: id}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundUser) {
                res.status(404).send();
            } else {
                if (req.body.name) {
                    foundUser.name = req.body.name;
                }

                if (req.body.password) {
                    foundUser.password = req.body.password;
                }
            }
        }

        res.send(foundUser);
    });
});

// log in user
router.post('/login', (req, res) => {
    var loginUser = req.body;
    loginName = loginUser.userName;
    loginPassword = loginUser.userPassword;

    usersCollection.findOne({userName: loginName, userPassword: loginPassword}, (err, foundUser) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!foundUser) {
            return res.status(404).send('Username or password does not match');
        }

        foundUser.isOnline = true;
        console.log('Logged in user is ' + foundUser);
        res.send(foundUser);
    });
});
// curl --data "userName=andrew&userPassword=qweqwe" http://localhost:3000/users/login

// add newUser
router.post('/add', (req, res) => {
    var newUser = new usersCollection();

    newUser.userName = req.body.userName;
    newUser.userAge = req.body.userAge;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;
    newUser.userAge = req.body.userAge;
    newUser.isEnabled = true;

    newUser.save((err, savedObject) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.send(savedObject);
        }
    });
});

// edit userName
router.put('/update/:id', (req, res) => {
    usersCollection.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            userName: req.body.userName
        }
    }, {upset: true}, (err, updatedUser) => {
        if (err) {
            console.log('error occured ' + err);
            res.status(500).send();
        } else {
            updatedUser.name = req.body.name;

            res.status(204);
        }
    });
});

// edit userPassword
router.put('/update/:id', (req, res) => {
    usersCollection.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            userPassword: req.body.userPassword
        }
    }, {upset: true}, (err, updatedUser) => {
        if (err) {
            console.log('error occured ' + err);
            res.status(500).send();
        } else {
            updatedUser.password = req.body.password;

            res.status(204);
        }
    });
});

// delete user
router.put('/delete/:id', (req, res) => {
    usersCollection.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            isEnabled: false
        }
    }, {upset: true}, (err, updatedUser) => {
        if (err) {
            console.log('error occured ' + err);
            res.status(500).send();
        } else {
            updatedUser.isEnabled = false;

            res.status(204);
        }
    });
});

module.exports = router;
