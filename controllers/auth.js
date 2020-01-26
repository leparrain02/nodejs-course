const User = require('../models/user');


exports.getLogin = (req,res,next) => {
  res.render('auth/login',{
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLogged
  });
};

exports.postLogin = (req,res,next) => {
  const email = req.email;
  const password = req.password;
  
  User.findById('5e2b9beccfdcd0148307221a')
  .then(user => {
    req.session.user = user;
    req.session.isLogged = true;
    req.session.save(err => {
      if(err){
        console.log(err);
      }
      res.redirect('/');
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