var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/users',require('./users'));
router.use('/user2',require('./user2'));
router.use('/auth', require('./auth'));

module.exports = router;
