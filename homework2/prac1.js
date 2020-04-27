function greet(){
    console.log('Hello');
}

function timer(){
    return setTimeout(()=>{
        return "End!";
    },3000);
}

greet();
timer();