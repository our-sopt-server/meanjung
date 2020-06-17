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
        const userIdx=req.decoded.userIdx;
        let profileImg=[];
        for(var i=0;i<3;i++){
            profileImg[i]=req.files[i];
        }
        if(profileImg===undefined||!userIdx){
            return res.status(CODE.OK)
            .send(util.fail(CODE.BAD_REQUEST, MSG.NULL_VALUE));
        }
        let type=[];
        for(var i=0;i<3;i++){
            type[i]=profileImg[i].mimetype.split('/')[1];
        }
        let locations=[];
        for(var i=0;i<3;i++){
            locations[i]=profileImg[i].location;
        }
        if(type[0]!=='jpeg' && type[0]!=='png' && type[0]!=='jpg' && type[1]!=='jpeg' && type[1]!=='png' && type[1]!=='jpg' && type[2]!=='jpeg' && type[2]!=='png' && type[2]!=='jpg'){
            return res.status(CODE.OK)
            .send(util.fail(CODE.OK, MSG.UNSUPPORTED_TYPE));
        }
        const result=await UserModel.updateProfile(userIdx, locations);
        res.status(CODE.OK)
        .send(util.success(CODE.OK, MSG.UPDATE_PROFILE_SUCCESS, result));
    }
}