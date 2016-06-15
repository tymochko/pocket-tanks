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
    var id = req.session.user;
    
    usersCollection.showProfile({_id: id}, (err, foundUser) => {
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
    var id = req.session.user;

    usersCollection.logoutUser({_id: id}, (err, foundUser) => {
        if (err) {
            res.status(401).send();
        }

        console.log(foundUser);
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

// edit userName
router.put('/update', (req, res) => {
    usersCollection.findOneAndUpdate({
        _id: req.body._id
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
router.put('/update', (req, res) => {
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
router.put('/delete', (req, res) => {
	console.log(req.body.id);
    usersCollection.findOneAndUpdate({
        _id: req.body.id
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

            res.status(204).send();
        }
    });
});

module.exports = router;
