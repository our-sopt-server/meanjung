var express=require('express');
var router=express.Router();
const userController=require('../controllers/post');

router.post('/write',userController.writePost);
router.get('/read/:id',userController.readPost);
router.post('/edit', userController.editPost);
router.delete('/delete/:title', userController.deletePost);
module.exports=router;