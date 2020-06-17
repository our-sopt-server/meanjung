const express = require('express');
const router = express.Router();
const UserController=require('../controllers/user');
const AuthMiddleware=require('../middlewares/auth');
const upload=require('../modules/multer');
/*
const multer=require('multer');
const upload=multer({
  dest:'upload/'
});
*/

router.post('signup',UserController.signup);
router.post('signin',UserController.signin);
router.post('/profile', AuthMiddleware.checkToken, upload.single('profile'), UserController.updateProfile);


module.exports = router;
