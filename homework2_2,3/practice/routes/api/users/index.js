var express=require('express');
var router=express.Router();

router.get('/',(req,res)=>{
    const result={
        status:200,
        message:'users 폴더에 접근합니다.'
    }
    res.status(200).send(result);
});
router.use('/login',require('./login'))
router.use('/signup',require('./signup'))
module.exports=router;