const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error404Controller = require('./controllers/error404');
const User = require('./models/user');

const app = express();
app.set('view engine','pug');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) =>{
  User.findById('5e2b9beccfdcd0148307221a')
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err);
  });
  
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(error404Controller.getError404);

mongoose.connect('mongodb://node-rw:qaz1234@localhost:27017/node_course?authSource=admin',{ useUnifiedTopology: true, useNewUrlParser: true })
.then(result => {
  User.findOne().then(user => {
    if(!user){
      user = new User({name: 'Marc', email: 'marc@noreply.com', cart: {items: []}});
      user.save()
      .catch(err => {
        console.log(err);
      });
    }
  });
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
