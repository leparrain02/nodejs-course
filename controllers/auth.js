const bcrypt = require('bcryptjs');

const User = require('../models/user');


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
    errorMessage: message
  });
};

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({email: email})
  .then(user => {
    if(!user){
      req.flash('error','Invalid username or password.');
      return res.redirect('/login');
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
      req.flash('error','Invalid username or password.')
      res.redirect('/login');
    });
  })
  .catch(err => {
    console.log(err);
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

  User.findOne({email: email})
  .then(existUser => {
    if(existUser){
      req.flash('error','User already exists.');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password,12)
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
    });
  })
  .catch(err => {
    console.log(err);
  });

};