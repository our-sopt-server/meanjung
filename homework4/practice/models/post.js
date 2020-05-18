const pool = require('../modules/pool');
const table ='post';
/*
postIdx
author
title
content - TEXT
createdAt
*/
const user={
    uploadPost:async (author, title, content, createdAt)=>{
        const question=`?,?,?,?`;
        const query=`insert into ${table} (author, title, content, createdAt) values (${question})`;
        const values=[author, title, content, createdAt];
        try{
            const result=await pool.queryParamArr(query, values);
            return result;
        }catch(err){
            return -1;
        }
    },
    //title은 중복되면 안됨
    checkOverlap: async (title)=>{
        const query=`select * from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                //title이 중복되지 않는다면
                return false;
            } else{
                //중복된다면
                return true;
            }
        }catch(err){
            throw err;
        }
    },
    getPost: async (author)=>{
        const query=`select * from ${table} where author="${author}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                //해당 저자의 글이 없다면
                return true;
            } else{
                return result;
            }
        } catch(err){
            throw err;
        }
    },
    checkTitle: async(title)=>{
        const query=`select * from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                return true;
            } else{
                return false;
            }
        } catch(err){
            throw err;
        }
    },
    revisePost: async (title, content)=>{
        const query=`update ${table} set content="${content}" where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            return result;
        } catch(err){
            console.log('Update ERROR');
            throw err;
        }
    },
    deletePost: async (title)=>{
        const query=`delete from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            return result;
        } catch(err){
            console.log('Delete ERROR');
            throw err;
        }
    }
}

module.exports=user;