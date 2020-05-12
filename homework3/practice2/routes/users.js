var express = require('express');
var router = express.Router();
let util=require('../modules/util');
let statusCode=require('../modules/statusCode');
let resMessage=require('../modules/responseMessage');
let crypto=require('crypto');
let fs=require('fs');



router.get('/sign',async(req, res)=>{
  const {id, password}=req.body;
  if(!id||!password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
  }
  let hashFunc=async(data)=>{
    const salt=crypto.randomBytes(32).toString('hex');
    try{
      const hashed=(await crypto.pbkdf2Sync(password,salt.toString(),1,32,'sha512')).toString('hex');
      await fs.writeFileSync('./pwhash/hashed.txt',`${hashed}\n${salt}`);
      console.log('success');
    } catch(err){
      throw err;
    }
  }
  const run=async () =>{
    await hashFunc(password);
  }
  run();
  res.status(statusCode.OK)
  .send('success');

})

module.exports = router;
