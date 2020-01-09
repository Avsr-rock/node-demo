var express = require('express');
var router = express.Router();
var path = require('path'); 
var mongo = require('mongodb');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var db=require('../models/all-models');
var formidable = require('formidable');
const multer = require('multer');


/* GET home page. */
router.get('/title', function(req, res, next) {
  res.render('index', { title: 'Express' });

});
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/welcome', function(req, res, next) {
  res.render('welcome');
});

router.get('/reserpassword', function(req, res, next) {
  res.render('reserpassword');
});

router.get('/fileupload', function(req, res, next) {
  res.render('fileupload');
});

router.get('/',function(req,res){
  res.sendFile(__dirname + '/fileupload.hbs');
 
});


/*router.use('/', express.static(path.join(__dirname, 'public')))

*/

router.post('/sign_up' , async function(req,res){
	req.body.password=bcrypt.hashSync(req.body.password, 10);
	var data =await db.User.findOne({email:req.body.email});
    if(data){
        return res.status(200).json({
            status:'failed',
            message:'you are registered Please try again!'
        })
    }
	var name = req.body.name;
	var email= req.body.email;
	var pass = req.body.password;
	var phone = req.body.phone;
	var password = req.body.password; 				

	
	var data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone
	}
	
	
    db.User.create(req.body);
    res.redirect('/login');

});
router.post('/regi', async function(req, res) {
	const user = await db.User.findOne({email:req.body.email});
    console.log("password",user);
    if(!user){
       res.redirect('/signup')
    }
    var pwd=await bcrypt.compareSync(req.body.password, user.password);
    console.log(pwd);
    if(!pwd){
        res.redirect('/login')
    }else{
        res.redirect('/welcome')
    }
})

router.post('/reset', async function(req, res) {
  const user = await db.User.findOne({email:req.body.email});
     console.log("email", email);
    if(!email){
        return res.status(422).json({
            status:'failed',
            message:'email is not match !'
        })
    }
    var pwd=await bcrypt.compareSync(req.body.password, user.password);
    if(!pwd)
    {
        res.redirect('/') 
   
    }
    
    if(req.body.newpassword==req.body.confirmpassword)
    {
         res.redirect('/')   
    }

})


router.post('/', function (req, res){
    var form = new formidable.IncomingForm();
    if(form.error!=null)

    {
      return res.json(422, {
              result: 'Upload failed'
    });
  }
    form.parse(req);
    console.log("form",form);


    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/data/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    return res.json(200, {
              result: 'Upload Success'
    });
});



/*router.post('/', function(req, res) {
    res.json({ message: 'WELCOME' });   
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + 'data' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
  
})
//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
 
    res.send(files)
  
})


router.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };
db.collection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result)
 
    if (err) return console.log(err)
 
    console.log('saved to database')
    res.redirect('/')
   
     
  })
})
*/
module.exports = router;
 