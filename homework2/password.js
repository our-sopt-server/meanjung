const pw=require('./password');
const crypto=require('crypto');
const fs=require('fs');
/*
fs.readFile('password.txt',(err,data)=>{
    if(err) throw err;
    const salt=crypto.randomBytes(32).toString('hex');
    crypto.pbkdf2(data, salt, 1, 32, 'sha512', (err,derivedKey)=>{
        if(err) throw err;
        const hashed=derivedKey.toString('hex');
        fs.writeFile('hashed.txt',`${hashed}`,(err)=>{
            if(err) throw err;
            console.log("File saved")
        })
    })
});
*/

// 동기 방식으로

let readFunc=()=>new Promise(
    async (resolve, reject) => {
        try{
            const data = (await fs.readFileSync('./password.txt')).toString();
            resolve(data);
        }catch(e) {
            reject();
        }
    
})
let hashFunc= async (data)=>{
    const salt=crypto.randomBytes(32).toString('hex');
    try {
        const hashed = (await crypto.pbkdf2Sync(data, salt, 1, 32, 'sha512')).toString('hex');
        await fs.writeFileSync('./hashed.txt',`${hashed}\n${salt}`);
        console.log('write file complete');
    } catch(e){
        throw e;
    }
}

const run = async () => {
    const password = await readFunc();
    await hashFunc(password);
}
run();
