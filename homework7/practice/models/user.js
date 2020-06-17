const pool=require('../modules/pool');
const table='user';

const user={
    signup: async (id, name, password, salt, email)=>{
        const fields='id, name, password, salt, email';
        const question=`?,?,?,?,?`;
        const values=[id, name, password, salt, email];
        const query=`insert into ${table}(${fields})values(${question})`;
        try{
            const result=await pool.queryParamArr(query, values);
            const insertId=result.insertId;
            return insertId;
        }catch(err){
            console.log('signup ERR : ',err);
            throw err;
        }
    },
    checkUser: async (id)=>{
        const query = `select * from ${table} where id="${id}"`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                return false;
            }else{
                return true;
            }
        }catch(err){
            console.log('checkUser ERR : ',err);
            throw err;
        }
    },
    getUserById: async(id)=>{
        const query=`select * from ${table} where id="${id}"`;
        try{
            return await pool.queryParam(query);
        }catch(err){
            console.log('getUserById ERR : ',err);
            throw err;
        }
    },
    getUserByIdx: async(idx)=>{
        const query=`select * from ${table} where userIdx="${idx}"`;
        try{
            return await pool.queryParam(query);
        }catch(err){
            console.log('getUserByIdx ERR : ',err);
            throw err;
        }
    },
    updateProfile: async(userIdx, profile)=>{
        let query=`update ${table} set image="${profile}" where userIdx="${userIdx}"`;
        try{
            await pool.queryParam(query);
            query=`select id, name, email, image from ${table} where userIdx="${userIdx}"`;
            const result=await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('update profile ERR : ',err);
            throw err;
        }
    }
}

module.exports=user;