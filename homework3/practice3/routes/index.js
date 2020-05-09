var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/users', require('./users'));
router.get('/',(req,res)=>{
  res.send("test");
})

module.exports = router;
