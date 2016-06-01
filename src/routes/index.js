const express = require('express');
const router = express.Router();
const User = require('../models/users.js');

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log('hello');
});

router.post('/register', (req, res) => {
    let userName = req.body.username;
    let userEmail = req.body.useremail;
    let userPassword = req.body.userpassword;

    let newUser = new User();
    newUser.userName = userName;
    newUser.userEmail = userEmail;
    newUser.userPassword = userPassword;
    newUser.save((err, savedUser) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        };

        return res.status(200).send();
    })
});

module.exports = router;
