var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log('Im working!');
    res.render('game');
});

module.exports = router;
