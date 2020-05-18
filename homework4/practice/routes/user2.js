var express = require('express');
var router = express.Router();
let UserModel=require('../models/post');
let util=require('../modules/util')
let statusCode=require('../modules/statusCode')
let resMessage=require('../modules/responseMessage')

router.post('/upload', async(req, res)=>{
    const {author, title, content, createdAt}=req.body;
    if(!author||!title||!content||!createdAt){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    if(await UserModel.checkOverlap(title)){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        return ;
    }
    const result=await UserModel.uploadPost(author, title, content, createdAt);
    if(result==-1){
        return res.status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR,'Insert Failed'));
        return ;
    }
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.CREATED_USER));
})

router.get('/getpost', async(req, res)=>{
    const {author}=req.body;
    if(!author){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    const result=await UserModel.getPost(author);
    if(result===true){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        return ;
    }
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.READ_POST_SUCCESS,result));
})

router.post('/revise', async(req, res)=>{
    const {title, content}=req.body;
    if(!title||!content){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    if(await UserModel.checkTitle(title)){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_FAIL));
        return;
    }
    const result=await UserModel.revisePost(title, content);
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.UPDATE_SUCCESS,result));
})

router.delete('/:title', async(req, res)=>{
    const title=req.params.title;
    if(await UserModel.checkTitle(title)){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_FAIL));
        return;
    }
    const result=await UserModel.deletePost(title);
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK,resMessage.DELETE_TITLE,'DELETE 성공!!'));
})

module.exports=router;