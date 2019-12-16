const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
app.set('view engine','pug');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes.route);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('error404',{pageTitle: 'Page Not Found'});
});

app.listen(3000);