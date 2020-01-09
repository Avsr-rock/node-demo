
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

module.exports = {
   userValidation:userValidation
   
}

function userValidation(req, res, next) {
 req.checkBody({
   'email': {
       notEmpty: {
           errorMessage: 'Email is required'
       },
     matches: {
         options: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
         errorMessage: 'Email should only contain email format ex abc@test.com'
     },
     errorMessage: 'Email is required'
   },
    'phone': {
       notEmpty: {
           errorMessage: 'Phone number is required'
       },
       isLength: {
           options: [{ min:10, max:10 }],
           errorMessage: 'Your phone number must contain exactly 10 numbers'
       },
       errorMessage: 'Phone number is required'
   },
   'password' : {
    notEmpty: {
      errorMessage: 'password is required'
    },
    isLength:{
    options: [{min: 5}],
    errorMessage: 'Your password contain minimum 5 charatcer includeing 1 numaric'
   }
 }

 });


req.getValidationResult().then(function(result) {
 var data = result.array();
   if (!result.isEmpty()) {
     // return error if there is validation error
     return res.status(200)
     .json({
       status: 'failed',
       message:data[0].msg
     });
   } else {
     return next();
   }
 });

}