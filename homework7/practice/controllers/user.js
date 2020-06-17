const UserModel = require('../models/user');
const util = require('../modules/util');
const CODE = require('../modules/statusCode');
const MSG = require('../modules/responseMessage');
const encrypt = require('../modules/crypto');
const jwt = require('../modules/jwt');

module.exports={
    signup :  async (req, res)=>{
        const {
            id,
            name,
            password,
            email
        }=req.body;
        if(!id||!name||!password||!email){
            res.status(CODE.BAD_REQUEST)
            .send(util.fail(CODE.BAD_REQUEST, MSG.NULL_VALUE));
            return;
        }
        if(await UserModel.checkUser(id)){
            res.status(CODE.BAD_REQUEST)
            .send(util.fail(CODE.BAD_REQUEST, MSG.ALREADY_ID));
            return;
        }
        const {
            salt,
            hashed
        } = await encrypt.encrypt(password);
        const idx=await UserModel.signup(id, name, hashed, salt, email);
        if(idx===-1){
            return res.status(CODE.DB_ERROR)
            .send(util.fail(CODE.DB_ERROR, MSG.DB_ERROR));
        }
        res.status(CODE.OK)
        .send(util.success(CODE.OK, MSG.CREATED_USER,{userId: idx}));
    },
    signin: async (req,res)=>{
        const {
            id,
            password
        } = req.body;
        if(!id||!password){
            res.status(CODE.BAD_REQUEST)
            .send(util.fail(CODE.BAD_REQUEST, MSG.NULL_VALUE));
            return;
        }
        const user=await UserModel.getUserById(id);
        if(user[0]===undefined){
            return res.status(CODE.BAD_REQUEST)
                .send(util.fail(CODE.BAD_REQUEST, MSG.NO_USER));
        }
        const hashed=await encrypt.encryptWithSalt(password,user[0].salt);
        if(hashed!==user[0].password){
            return res.status(CODE.BAD_REQUEST)
                .send(util.fail(CODE.BAD_REQUEST, MSG.MISS_MATCH_PW));
        }
        const{
            token,
            refreshToken
        } = await jwt.sign(user[0]);
        res.status(CODE.OK)
        .send(util.success(CODE.OK, MSG.LOGIN_SUCCESS,{
            accessToken : token
        }));
    },
    updateProfile: async (req, res)=>{
        const userIdx=req.decode.userIdx;
        const profileImg=req.file.location;
        if(profileImg===undefined||!userIdx){
            return res.status(CODE.OK)
            .send(util.fail(CODE.BAD_REQUEST, MSG.NULL_VALUE));
        }
        const type=req.file.mimetype.split('/')[1];
        if(type!=='jpeg' && type!=='png' && type!=='jpg'){
            return res.status(CODE.OK)
            .send(util.fail(CODE.OK, MSG.UNSUPPORTED_TYPE));
        }
        const result=await UserModel.updateProfile(userIdx, profileImg);
        res.status(CODE.OK)
        .send(util.success(CODE.OK, MSG.UPDATE_PROFILE_SUCCESS, result));
    }
}