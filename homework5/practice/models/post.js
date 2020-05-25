const pool=require('../modules/pool');
const table='post';

const models={
    post: async (author, title, content, createdAt)=>{
        const fields='author, title, content, createdAt';
        const questions=`?,?,?,?`;
        const values=[author, title, content, createdAt];
        const query=`insert into ${table} (${fields}) values (${questions});`;
        try{
            const result=await pool.queryParamArr(query, values);
            const insertId=result.insertId;
            return insertId;
        }catch(err){
            if(err.errno==1062){
                console.log('post ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('post ERROR : ',err);
            throw err;
        }
    },
    read: async (author)=>{
        const query=`select * from ${table} where author="${author}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                return false;
            }else{
                return result;
            }
        }catch(err){
            throw err;
        }
    },
    checkTitle:async(title)=>{
        const query=`select * from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                return false;
            }else{
                return true;
            }
        }catch(err){
            throw err;
        }
    },
    update:async(title, updatedTitle, updatedContent)=>{
        const query=`update ${table} set title="${updatedTitle}", content="${updatedContent}" where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            const readQuery=`select * from ${table} where title="${updatedTitle}";`;
            const readResult=await pool.queryParam(readQuery);
            return readResult;
        }catch(err){
            throw err;
        }
    },
    getFromTitle:async (title)=>{
        const query=`select * from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            return result;
        }catch(err){
            throw err;
        }
    },
    delete:async (title)=>{
        const query=`delete from ${table} where title="${title}";`;
        try{
            const result=await pool.queryParam(query);
            return true;
        }catch(err){
            throw err;
        }
    }
    
}

module.exports=models;
