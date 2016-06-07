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
4) user profile page change info request

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
    var newUser = new User();

    newUser.userName = req.body.userName;
    newUser.userEmail = req.body.userEmail;
    newUser.userPassword = req.body.userPassword;

    console.log(newUser);

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

// curl -H "Content-Type: application/json" -X POST -d '{"userName":"Tom", "userEmail":"tom@example.com", "userPassword":"qweqwe"}' http://localhost:3000/users/add

router.put('/update', (req, res) => {
    var id = req.body;
    console.log(id);
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

module.exports = router;