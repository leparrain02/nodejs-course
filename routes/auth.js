const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const authController=require('../controllers/auth.js');

const router = express.Router();

router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);
router.post('/logout',authController.postLogout);
router.get('/signup',authController.getSignup);

router.post('/signup',
  body('email').isEmail().withMessage('You must enter a valid email address.')
  .custom((value, {req}) => {
    return User.findOne({email: value})
    .then(existUser => {
      if(existUser){
        return Promise.reject('This email already exists.');
      }
      return true;
    })
  }),
  body('password').isLength({min: 6}).withMessage('Your password must have at least 6 caracters')
  .isAlphanumeric().withMessage('Your password must contain only alphanumeriuc'),
  body('confirmpassword').custom((value,{req}) => {
    if( value.toString() !== req.body.password.toString() ){
      return Promise.reject('Confirm password must be the same than password');
    }
    return true;
  }),
  authController.postSignup);

router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword);

module.exports = router;
