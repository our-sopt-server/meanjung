var express = require('express');
var router = express.Router();
//var users=require('./users');

router.use('/users',require('./users'));
router.use('/profile', require('./profile'));
//router.use('users',users);
module.exports = router;
