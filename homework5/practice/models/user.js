const pool = require('../modules/pool');
const table ='user';
const crypto=require('crypto');

const user={
    signup: async (id, name, password, salt, email) => {
        const fields = 'id, name, password, salt, email';
        const questions = `?, ?, ?, ?, ?`;
        const values = [id, name, password, salt, email];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions});`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },
    checkUser: async (id) => {
        const query=`select * from ${table} where id="${id}";`;
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){//중복된 사용자가 없다.
                return false;
            } else {
                return true;
            }
        } catch(err){
            throw err;
        }
    },
    signin: async (id, password) => {
        const query = `select password, salt from ${table} where id="${id}";`; 
        try{
            const result=await pool.queryParam(query);
            if(result.length===0){
                //id fail
                return true;
            } else{
                //맞는 id는 존재
                const pw=result[0].password;
                const hashed=(await crypto.pbkdf2Sync(password,result[0].salt,1,32,'sha512')).toString('hex');
                if(hashed==pw){
                    return false;
                } else{
                    return true;
                }
            }
        } catch(err){
            throw err;
        }   
    },
    getUserById: async (id) =>{
        const query=`select * from ${table} where id="${id}";`;
        try{
            return await pool.queryParam(query);
        } catch(err){
            console.log('checkUser ERROR : ',err);
            throw err;
        }
    }
}

module.exports=user;