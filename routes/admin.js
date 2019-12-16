const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();
const products = [];

router.post('/add-product',(req,res,next) => {
  products.push(req.body.title)
  res.redirect('/');
});

router.get('/add-product', (req,res,next) => {
  res.sendFile(path.join(rootDir,'views','add-product.html'));
});

module.exports = {
  route: router,
  product: products
}