var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// const mongoose = require('mongoose');
const usersCollection = require('../models/users');

/* GET users listing. */
// router.get('/', (req, res) => {
//     usersCollection.find((err, users) => {
//         console.log(users);
//         res.send(users);
//     });
// });

/* TODO

1) registration/login check request
2) dashboard online users request
3) user profile page info request
4) user profile page change userName request
5) user profile page change userPassword request
6) password requirements

*/

router.get('/', (req, res) => {
    usersCollection.find((err, users) => {
        console.log(users);
        res.send(users);
    });
});

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

router.post('/add', (req, res) => {
    var newUser = new usersCollection();

    newUser.userName = req.body.userName;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;

    newUser.save((err, savedObject) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(savedObject);
            res.send(savedObject);
        }
    });
});

// router.put('/update/:id', (req, res) => {
//     usersCollection.findOneAndUpdate({
//         _id: req.params.id
//     },{
//         $set: {
//             userName: req.body.userName,
//             userPassword: req.body.userPassword
//         }
//     }, {upset: true}, (err, updatedUser) => {
//         if (err) {
//             console.log('error occured');
//         } else {
//             console.log(updatedUser);
//             res.status(204);
//         }
//     });
// });

router.put('/update/:id', (req, res) => {
    usersCollection.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            userName: req.body.userName,
            userPassword: req.body.userPassword
        }
    }, {upset: true}, (err, updatedUser) => {
        if (err) {
            console.log('error occured ' + err);
            res.status(500).send();
        } else {
            if (req.body.name) {
                updatedUser.name = req.body.name;
            }

            if (req.body.password) {
                updatedUser.password = req.body.password;
            }

            res.status(204);
        }
    });
});

module.exports = router;