var express = require('express');
var router = express.Router();
const userController=require('../controllers/user');

// signup - 회원가입 구현하기
router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.get('/getUser', userController.getUser);
module.exports = router;
