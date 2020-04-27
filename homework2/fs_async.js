//비동기 
//순서 정해지지 않음
const fs=require('fs');

const numArr=[1,2,3,4,5];

numArr.forEach(num => {
    const title='async'+num;
    const data=`파일이 잘 만들어 졌어요! \n제 이름은 '${title}.txt'입니다~`;
    fs.writeFile(`${title}.txt`, data,(err,data)=>{
        if(err) return console.log(err.message);
        console.log(`${title} 비동기라 순서가 뒤죽박죽`)
    }); 
});

