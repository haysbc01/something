var Auth = require('../models/auth.schema.js'),
    bcrypt = require('bcryptjs'),
    colors = require('colors');

module.exports = {
  registerUser : (req,res)=>{
    var newUser = new Auth(req.body);
    newUser.save(function(err,user){
      if(err){
        console.log(err)
        res.status(403).send(err)
      }else{
        // console.log('register success'.blue);
        req.session.uid = user._id;
        res.status(200).send(user)
      }
    })
  },

  loginUser : (req,res)=>{
    console.log('login')
    Auth.findOne({email:req.body.email}, function(err,user){
      if(err){
        console.log(err)

      }else if(!user){
        res.status(403).send('User not found');
      }else{
        bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched){
          if(bcryptErr){
            res.status(500).send('mongodb error');
          }else if(!matched){
            res.status(403).send('Incorrect Password!');
          }else{
            req.session.uid = user._id;
            res.send(user)
          }
        });
      }
    });
  },

  me: function(req,res){Auth.findOne({_id:req.session.uid}, function(err,user){
    res.send(user)
    });
  },

}