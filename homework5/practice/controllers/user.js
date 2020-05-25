const resMessage=require('../modules/responseMessage');
const statusCode=require('../modules/statusCode');
const util=require('../modules/util');
const UserModel=require('../models/user');
const crypto=require('crypto');
const jwt=require('../modules/jwt');
const TOKEN_EXPIRED=-3;
const TOKEN_INVALID=-2;

const controllers={
    //회원가입
    signup : async (req, res)=>{
        const{id, name, password, email}=req.body;
        //입력값이 하나라도 빠져있다면
        if(!id||!name||!password||!email){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST,resMessage.NULL_VALUE));
            return;
        }
        //중복된 id 체크
        if(await UserModel.checkUser(id)==true){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
            return;
        }
        const salt=(crypto.randomBytes(32)).toString('hex');
        const hashed=(await crypto.pbkdf2Sync(password,salt,1,32,'sha512')).toString('hex');
        const idx=await UserModel.signup(id, name, hashed, salt, email);
        if(idx===-1){
            return res.status(statusCode.DB_ERROR)
            .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.CREATED_USER,{userId:idx}));
    },
    //로그인
    signin : async(req, res)=>{
        const {id, password}=req.body;
        if(!id||!password){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST,resMessage.NULL_VALUE));
            return;
        }
        //해당 아이디가 db에 없다면
        const profile=await UserModel.getUserById(id);
        if(profile[0]===undefined){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
            return;
        }
        //아이디와 비밀번호가 맞지 않는다면
        const hashed=(await crypto.pbkdf2Sync(password,profile[0].salt,1,32,'sha512')).toString('hex');
        if(hashed!==profile[0].password){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
            return;
        }
        const {token, _}=await jwt.sign(profile[0]);
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {accessToken:token}));
    },
    auth : async (req, res)=>{
        const token=req.headers.token;
        if(!token){
            return res.json(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
        }
        const user=await jwt.verify(token);
        if(user==TOKEN_EXPIRED){
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
        }
        if(user==TOKEN_INVALID){
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
        }
        if(user.idx==undefined){
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
        }
        return res.json(util.success(statusCode.OK, resMessage.AUTH_SUCCESS));
    }
};
module.exports=controllers;