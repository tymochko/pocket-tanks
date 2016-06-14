var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var usersCollection = require('../models/users');

/* GET users listing. */

/* TODO

6) password requirements
7) log out - change online status

*/

// get all users in database, for instance in dashboard
router.get('/', (req, res) => {
    console.log(req);
    usersCollection.find((err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!users) {
            return res.status(404).send('Database is empty');
        }

        res.json({'users': users, 'myId': req.session.user});
    });
});

// get user's info by id, for instance in profile page
router.get('/:id', (req, res) => {
    var id = req.params.id;
    usersCollection.findOne({_id: id}, (err, foundUser) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!foundUser) {
            return res.status(404).send();
        }
        res.send(foundUser);
    });
});
// curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/users/:id

// log in user
router.post('/login', (req, res) => {
    var loginUser = req.body;
    loginName = loginUser.userName;
    loginPassword = loginUser.userPassword;

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
// curl --data "userName=andrew&userPassword=qweqwe" http://localhost:3000/users/login

// log out user
router.post('/logout/:id', (req, res) => {
    var id = req.params.id;
    usersCollection.findOne({_id: id}, (err, foundUser) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        if (!foundUser) {
            return res.status(404).send();
        }

        usersCollection.update({userName: foundUser.userName}, {isOnline: false}, function(err, res) {
            if (err)
                console.log(err);
            else {
                res.send(foundUser);
                req.session.destroy();
            }
        });
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
            res.json({'message': 'User registred'});
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
            return res.status(500).send();
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
            return res.status(500).send();
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
            return res.status(500).send();
        } else {
            updatedUser.isEnabled = false;

            res.status(204);
        }
    });
});

module.exports = router;
