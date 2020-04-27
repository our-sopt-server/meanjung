// mission 1
let isMomHappy=false;
let phone={
    brand: 'Samsung',
    color: 'black'
};

var willIGetNewPhone = new Promise((resolve, reject)=>{
    if(isMomHappy==true){
        resolve(phone);
    }
    else{
        reject(new Error('mom is not happy'));
    }
});

willIGetNewPhone
.then(result=>console.log(result))
.catch(result=>console.log(result));