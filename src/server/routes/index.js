var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.sendfile(path.resolve('src/client/index.html'));
});


module.exports = router;
