const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error404Controller = require('./controllers/error404')

const app = express();
app.set('view engine','pug');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(error404Controller.getError404);

app.listen(3000);