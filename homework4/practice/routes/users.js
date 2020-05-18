var express = require('express');
var router = express.Router();
let UserModel=require('../models/user');
let util=require('../modules/util')
let statusCode=require('../modules/statusCode')
let resMessage=require('../modules/responseMessage')
var crypto=require('crypto');

// signup - 회원가입 구현하기
router.post('/signup', async (req, res) => {
  const {id, name, password, email} = req.body;
  if (!id || !name || !password || !email) {
      res.status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
  }
  // 사용자 중인 아이디가 있는지 확인
  if (await UserModel.checkUser(id)) {
    res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
    return;
  }
  const salt = 'dfw23EFVR3fefnd68FW3r4343';
  const hashed=(await crypto.pbkdf2Sync(password,salt,1,32,'sha512')).toString('hex');
  const idx = await UserModel.signup(id, name, hashed, salt, email);
  if (idx === -1) {
      return res.status(statusCode.DB_ERROR)
          .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
  }
  res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.CREATED_USER, {userId: idx}));
});


router.post('/signin', async (req, res)=>{
  const {id, password}=req.body;
  // 어느 하나의 data가 빠져있으면
  if(!id||!password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }
  if(await UserModel.signin(id, password)){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
    return;
  }
  res.status(statusCode.OK)
  .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS,{userId:id}));
});

router.get('/getUser', async (req, res)=>{
  const {id}=req.body;
  if(!id){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }
  const profile=await UserModel.getUserById(id);
  if(profile===true){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
  }else{
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS,`name:${profile[0].name}, email:${profile[0].email}`));
  }
})
module.exports = router;
