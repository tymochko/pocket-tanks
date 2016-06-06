var express = require('express');
var router = express.Router();

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

router.put('/update/:id', (req, res) => {
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

        console.log(foundUser);
    });
});

module.exports = router;