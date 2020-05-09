var express = require('express');
var router = express.Router();
const UserModel=require('../models/user')
const responseMessage=require('../modules/responseMessage')
const statusCode=require('../modules/statusCode')
const util=require('../modules/util')

router.post('/signin',async(req,res)=>{
  const {id, password}=req.body;
  console.log(id)
  if(!id||!password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    return;
  }
  const user=UserModel.filter(it=>it.id==id);
  if(user.length==0){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST,responseMessage.NO_USER));
    return ;
  }

  if(user[0].password!=password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST,responseMessage.MISS_MATCH_PW));
    return ;
  }

  //성공
  res.status(statusCode.OK)
  .send(util.success(statusCode.OK,responseMessage.LOGIN_SUCCESS));

});

module.exports = router;
