
var db=require('../models/all-models');
const bcrypt = require('bcryptjs');
var nodemailer=require('nodemailer');

module.exports={  
   user:user,
   login:login,
   updateUser:updateUser,
   deleteUser:deleteUser,
   resetpassword:resetpassword,
   sendMail:sendMail,
   avg:avg,
   mark:mark

}
async function user(req, res){
     const user = await db.User.findOne({email:req.body.email});
    console.log("password",user);
    if(user){
       return res.status(200).json({
            status:'failed',
            message:'Email already exits'
        })
    }
req.body.password=await bcrypt.hashSync(req.body.password, 10);
var newUser=new db.User({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password
    });
    await newUser.save();


    var saveData = await db.User.find({email:req.body.email});

    if(!saveData){
        return res.status(200).json({
            status:'failed',
            message:'you are not registered pleas try again!'
        })
    }else{
        return res.status(200).json({
            status:'success',
            message:'Registered successfully!',
            saveData:saveData
        });
    }
}

async function mark(req, res){
    const mark = await db.User.findOne({email:req.body.email});
    console.log(mark);
    if(mark){
       return res.status(200).json({
            status:'failed',
            message:'Email already exits'
        })
    }
 var marks=new db.Mark({
        userid:mark.id,
        name:req.body.name,
        english:req.body.english,
        math:req.body.math
    });
    await marks.save();


    var saveData = await db.User.find({email:req.body.email});

    if(!saveData){
        return res.status(200).json({
            status:'failed',
            message:'you are not registered pleas try again!'
        })
    }else{ 
        return res.status(200).json({
            status:'success',
            message:'Registered successfully!',
            saveData:saveData
        });
    }
}


async function avg(req, res){
    const user = await  db.User.aggregate([ { $group:
        { _id: 
            { 
                math:{ $avg: "$math"},
                english: { $avg: "$english"}
            }
        }
    }
        ])
    console.log(user);
    if(user){
        return res.status(200).json({
            status:'success',
            message:'avg is '
        })
    }
}
 
 async function login(req, res){
   
    const user = await db.User.findOne({email:req.body.email});
    console.log("password",user);
    if(!user){
       return res.status(200).json({
            status:'failed',
            message:'not found!'
        })
    }
    var pwd=await bcrypt.compareSync(req.body.password, user.password);
    console.log(pwd);
    if(!pwd){
        return res.status(200).json({
            status:'failed',
            message:'Incorrect password!'
        })
    }else{
        return res.status(200).json({
            status:'success',
            message:'Login successfully'
        });
    }
}

async function updateUser(req,res){
    var email=await db.User.findOne({email:req.body.email});
    if(!email){
        return res.status(422).json({
            status:'failed',
            message:'email is not match!'
        })
    }
    const updateUser = await db.User.updateMany({email:req.body.email},{$set:{phone:req.body.phone,name:req.body.name}});
    var email=await db.User.findOne({email:req.body.email});
    return res.status(200).json({
        status:'success',
        message:'profile updated successfully',
        data:email
    });
}
 
async function deleteUser(req,res){
    var email=await db.User.findOne({email:req.body.email});
    if(!email){
        return res.status(422).json({
            status:'failed',
            message:'email is not match!'
        })
    }
    var deleteUser = await db.User.deleteOne({email:req.body.email});
    console.log('req.body',req.body);
    return res.status(200).json({
        status:'success',
        message:'profile delete successfully',
        data:email
    });

}



async function resetpassword(req,res){
    var email=await db.User.findOne({email:req.body.email});
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
        return res.status(422).json({
            status:'failed',
            message:'password is not match !'  
   
    });
    }
    if(req.body.newpassword==req.body.confirmpassword)
    {
        return res.status(422).json({
            status:'failed',
            message:'password is not match !'
   
    });
    }
      const mailOptions = {  
                to:'amratanshu.yugasa@gmail.com' ,  
                from: 'amratanshu.yugasa@gmail.com',  
                subject: 'Node.js Password Reset',  
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +  
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
            };  
            smtpTransport.sendMail(mailOptions, function(err) {                 
                console.log("HI:"+emailVal);  
                res.json({status : 'success', message : 'An e-mail has been sent to ' + emailVal + ' with further instructions.'});              
                done(err, 'done');  
            });  
 const updateUser = await db.User.updateOne({email:req.body.email},{$set:{password:req.body.newpassword}});
    var email=await db.User.findOne({email:req.body.email});
    return res.status(200).json({
        status:'success',
        message:'password updated successfully',
        data:email
    });   
}


async function sendMail(req,res){
var transporter = await nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amratanshu.yugasa@gmail.com',
    pass: 'AmratV&7'
  }
});

var mailOptions = {
  from: 'amratanshu.yugasa@gmail.com',
  to: 'amratanshu.yugasa@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.res);
  }
});
}




