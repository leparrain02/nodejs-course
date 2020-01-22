const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error404Controller = require('./controllers/error404');
const MongoConnect = require('./util/database').MongoConnect;
const User = require('./models/user');

const app = express();
app.set('view engine','pug');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) =>{
  User.findById('5e1e69011eef691c4a4cc4e1')
  .then(user => {
    req.user = new User(user.username, user.email, user.cart, user._id);
    next();
  })
  .catch(err => {
    console.log(err);
  });
  
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(error404Controller.getError404);

MongoConnect(() =>{
  app.listen(3000);
});
