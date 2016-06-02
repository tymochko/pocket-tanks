var express = require('express');
var router = express.Router();

// // require mongoose dep - MongoDB Object modeling
// const mongoose = require('mongoose');
const usersCollection = require('../models/users');

/* GET users listing. */
router.get('/', (req, res) => {
    console.log('Getting all the users');git
    usersCollection.find((err, users) => {
        if (err) {
          res.send(err);
        }

        console.log(users);
        res.send(users);
    });
});

module.exports = router;
