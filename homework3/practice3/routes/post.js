var express = require('express');
var router = express.Router();
var fs=require('fs');
let util=require('../modules/util');
let resMessage=require('../modules/responseMessage');
let statusCode=require('../modules/statusCode');

/*
게시글 생성
title - id(번호로)
des - description(글 내용)
*/
router.post('/', (req, res)=>{
    const {title, des}=req.body;
    if(!title||!des){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST,resMessage.NULL_VALUE));
    }
    /*
    ...
    중복처리
    ...
    */
    fs.writeFile(`./scripts/${title}`, des, (err)=>{
        if(err) throw err;
        res.status(200).send("File Post Success");
    });
});

router.get('/:id', async (req, res)=>{
    const {id}=req.params;
    /*
    scripts 폴더에 존재하지 않는 파일 이름이라면
    */
    try{
        var data=fs.readFileSync(`./scripts/${id}`,'utf8');
    }catch(err){
        res.status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, err));
        return ;
    }
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK,'success',data));
    return ;
});

router.put('/:id', async (req, res)=>{
    const {id}=req.params;
    const {des}=req.body;
    try{
        var data=fs.readFileSync(`./scripts/${id}`,'utf8');
        fs.writeFileSync(`./scripts/${id}`,des);
    }catch(err){
        res.status(400)
        .send('break!!'+err);
    }
    res.status(200)
    .send('success');
})

router.delete('/:id', async (req, res)=>{
    const {id}=req.params;
    try{
        fs.unlinkSync(`./scripts/${id}`);
    }catch(err){
        res.status(400)
        .send('break!!'+err);
    }
    res.status(200)
    .send('delete complete');
})
module.exports = router;
