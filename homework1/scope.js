function funcScope(){
    var v1=123;
    if(true){
        var v2=123;
        let ll='abc';
        console.log('let은 block scope, ll:',ll);
    }
    //console.log('let은 block scope, ll:',ll);
    console.log('var은 function scope, v2:',v2);
    console.log('var은 function scope, v1',v1)
}
funcScope();
//console.log('var은 function scope, v2:',v2);