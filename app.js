const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const config = require('config');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const error404Controller = require('./controllers/error404');
const User = require('./models/user');



const MONGODBURI = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.password}/${config.mongodb.dbname}?${config.mongodb.paramURI}`;

const store = new MongoDBSession({
  uri: MONGODBURI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const app = express();
app.set('view engine','pug');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret: config.app.sessions.secret, 
  resave: false, 
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash());



app.use((req,res,next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err);
  });

});

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(error404Controller.getError404);

mongoose.connect(MONGODBURI,config.mongodb.params)
.then(result => {
  app.listen(config.app.port);
})
.catch(err => {
  console.log(err);
});
