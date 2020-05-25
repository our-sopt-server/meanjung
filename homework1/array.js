var server1=["요소1","요소2",43,null,true];
var server2=Array("요소1","요소2",13);
var server3=new Array("요소1","요소2",false,undefined);

console.log('server1:',server1);
console.log('server2:',server2);
console.log('server3:',server3);

server1.push(123);
server2[server1.length]="뭐 넣지";
server3[99]="server3의 길이는 얼마일까요?";

console.log('server1:',server1);
console.log('server2:',server2);
console.log('server3:',server3);

let str1='server1에는 "';
for(var item of server1){
    str1+=item+',';
}
str1+='"이 들어있네요~';
console.log(str1);


let str2='server2에는 "';
for(var item in server2){
    str2+=server2[item]+',';
}
str2+='"이 들어있네요~';
console.log(str2);

let str3='server3에는 "';
server3.forEach(item=>str3+=item+',');
str3+='"이 들어있네요~';
console.log(str3);
