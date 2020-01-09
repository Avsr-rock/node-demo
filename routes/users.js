var express = require('express');
var router = express.Router();
var users=require('../controllers/users.js');
var validate=require('../validation/userValidation.js');
var nodemailer=require('nodemailer');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/user',validate.userValidation, users.user);
router.post('/updateUser',validate.userValidation, users.updateUser);
router.post('/deleteUser', users.deleteUser);
router.post('/resetpassword', users.resetpassword);
router.post('/login',validate.userValidation, users.login);
router.post('/sendMail',users.sendMail);
router.post('/marks', users.mark);


module.exports = router;
