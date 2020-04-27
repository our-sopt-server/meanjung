function task1(){
    setTimeout(()=>{
        console.log('task1');
    },0);
}

function task2(){
    console.log('task2');
}

function task3(){
    console.log('task3');
}

task1()
task2()
task3()

// 출력 순서
// 0초 인데 왜 2,3,1 순서인가
