const statusCode=require('../modules/statusCode');
const resMessage=require('../modules/responseMessage');
const util=require('../modules/util');
const UserModel=require('../models/user');
const PostModel=require('../models/post');

const controllers={
    writePost : async (req, res)=>{
        const{author, title, content, createdAt}=req.body;
        //null값 확인
        if(!author||!title||!content||!createdAt){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        //title중복 확인
        if(await PostModel.checkTitle(title)){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.TITLE_OVERLAP));
            return ;
        }
        const user=await UserModel.getUserById(author);
        //해당 id가 존재하는지 user 테이블에서 확인
        if(user[0]===undefined){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
            return;
        }
        const idx=await PostModel.post(author, title, content, createdAt);
        if(idx===-1){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
            return ;
        }
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.WRITE_POST_SUCCESS, {accessToken:token}));
    },
    readPost:async (req, res)=>{
        const id=req.params.id;
        if(!id){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        //해당 author의 글이 하나도 없을 때
        const content=await PostModel.read(id);
        if(content===false){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POST));
            return;
        }
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.READ_POST_SUCCESS,content));
    },
    editPost : async (req, res)=>{
        const{title, updatedTitle, updatedContent}=req.body;
        if(!title||!updatedTitle||!updatedContent){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        //제목이 title인 글이 존재하지 않음
        const getfromtitle=await PostModel.getFromTitle(title);
        if(getfromtitle[0]===undefined){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CONTENT));
            return;
        }
        //update되는 title 중복 확인
        if(await PostModel.checkTitle(updatedTitle)){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.TITLE_OVERLAP));
            return ;
        }
        const result=await PostModel.update(title, updatedTitle, updatedContent);
        
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.UPDATE_SUCCESS, result));

    },
    deletePost : async (req, res)=>{
        const title=req.params.title;
        if(!title){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const getfromtitle=await PostModel.getFromTitle(title);
        if(getfromtitle[0]===undefined){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_FAIL));
            return;
        }
        const delResult=await PostModel.delete(title);
        if(delResult!==true){
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_FAIL));
            return;
        }
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.DELETE_TITLE, "해당 제목의 글 삭제 완료"));
        
    }
}

module.exports=controllers;