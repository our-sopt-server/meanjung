var express = require('express');
var router = express.Router();
let UserModel=require('../models/user');
let util=require('../modules/util')
let statusCode=require('../modules/statusCode')
let resMessage=require('../modules/responseMessage')
// signup - 회원가입 구현하기

router.post('/signup', async (req, res)=>{
  const{id, name, password, email}=req.body;
  
  if(!id||!name||!password||!email){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }
  /*
  if(UserModel.filter(user=>user.id==id).length>0){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
    return;
  }
  UserModel.push({id, name, password, email});
  console.log(UserModel)
  res.status(statusCode.OK)
  .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
    userID:id
  }));
  */
 const salt='dfasdlkfalgkhwihasfgng';
 const idx=await UserModel.signup(id, name, password, email);
 if(idx===-1){
   return res.suatus(statusCode.DB_ERROR)
   .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
 }
 res.status(statusCode.OK)
 .send(util.success(statusCode.OK, resMessage.CREATED_USER, {userId:idx}));
});



// signin - 로그인 구현하기

router.post('/signin',async(req, res)=>{
  const {id, password}=req.body;
  // 어느 하나의 data가 빠져있으면
  if(!id||!password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }
  const user=UserModel.filter(user=>user.id==id);
  // 해당 id가 없으면
  if(user.length==0){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    return;
  }
  // 비밀번호 확인
  if(user[0].password!==password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    return;
  }
  res.status(statusCode.OK)
  .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS,{userId:id}));
});

module.exports = router;
