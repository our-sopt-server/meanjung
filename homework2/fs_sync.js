const fs=require('fs');
const numArr=[1,2,3,4,5];

numArr.forEach(num => {
    const title='sync'+num;
    const data=`파일이 잘 만들어 졌어요!\n제 이름은 '${title}.txt'입니다~`;
    fs.writeFileSync(`${title}.txt`,data);
    console.log(`${title} 동기라 순서에 맞게~`);
});