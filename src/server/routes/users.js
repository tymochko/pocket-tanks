var express = require('express');
var router = express.Router();

// const mongoose = require('mongoose');
const usersCollection = require('../models/users');

/* GET users listing. */
router.get('/', (req, res) => {
    usersCollection.find((err, users) => {
        res.send(users);
    });
});

/* TODO

1) registration/login check request
2) dashboard online users request
3) user profile page info request
4) user profile page change info request

*/

module.exports = router;