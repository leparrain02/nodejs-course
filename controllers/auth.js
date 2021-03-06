const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const config = require('config');

const User = require('../models/user');

// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth: {
//     api_key: config.mailer.apikey
//   }
// }));


exports.getLogin = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  
  res.render('auth/login',{
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    email: ''
  });
};

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({email: email})
  .then(user => {
    if(!user){
      return res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        errorMessage: 'Invalid username or password.',
        email: email
      });
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if(doMatch){
        req.session.user = user;
        req.session.isLogged = true;
        return req.session.save(err => {
          if(err){
            console.log(err);
          }
          res.redirect('/');
        });
      }
      res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        errorMessage: 'Invalid username or password.',
        email: email
      });
    });
  })
  .catch(err => {
    next(new Error(err));
  });
};

exports.postLogout = (req,res,next) => {
  req.session.destroy(err => {
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.getSignup = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup',{
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return res.status(422).render('auth/signup',{
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg
    });
  }

  bcrypt.hash(password,12)
  .then(encryptPassword => {
    const user = new User({
      email: email,
      password: encryptPassword,
      cart: {items: []}
    });
    return user.save();
  })
  .then(result => {
    res.redirect('/login');
      // return transporter.sendMail({
      //   to: email,
      //   from: config.mailer.from,
      //   subject: 'Signup sucessfull',
      //   html: '<h1>Sucessfull!!!</h1>'
      // })
      // .catch(err => {
      //   console.log(err);
      // });
  })
  .catch(err => {
    next(new Error(err));
  });
};

exports.getReset = (req,res,next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset-password',{
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message
  });
};

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32,(err,buffer) => {
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        req.flash('error','No user found with that email');
        return res.redirect('/reset');
      }
      user.resetToken=token;
      user.resetTokenExpiration=Date.now() + 3600000;
      return user.save()
      .then(result => {
        console.log(`http://localhost:3000/reset/${token}`);
        res.redirect('/login');
      })
      .catch(err => {
        next(new Error(err));
      });
    })
    .catch(err => {
      next(new Error(err));
    });
  });
};

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    if(!user){
      req.flash('error','Invalid token');
      return res.redirect('/login');
    }
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    } else {
      message = null;
    }
  
    res.render('auth/new-password',{
      pageTitle: 'Enter new Password',
      path: '/reset',
      errorMessage: message,
      userId: user._id,
      resetToken: token
    });

  })
  .catch(err => {
    next(new Error(err));
  });
};


exports.postNewPassword = (req,res,next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const token = req.body.resetToken;
  let resetUser;

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()},_id: userId})
  .then(user => {
    if(!user){
      req.flash('error','Invalid token');
      return res.redirect('/login');
    }
    resetUser = user;
    bcrypt.hash(password,12)
    .then(encryptedPassword => {
      resetUser.password = encryptedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      next(new Error(err));
    });
  })
  .catch(err => {
    next(new Error(err));
  });  
};