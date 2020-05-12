var express=require('express');
var router=express.Router();
let UserModel=require('../models/user');
let util=require('../modules/util')
let statusCode=require('../modules/statusCode')
let resMessage=require('../modules/responseMessage')

router.get('/:id', async(req, res)=>{
    const {id}=req.params;
    if(!id){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        return ;
    }
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, { UserID : id }));

});

module.exports=router;