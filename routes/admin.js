const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();
const products = [];

router.post('/add-product',(req,res,next) => {
  products.push(req.body)
  res.redirect('/');
});

router.get('/add-product', (req,res,next) => {
  res.render('add-product',{pageTitle: 'Add Product', path: '/admin/add-product'});
});

module.exports = {
  route: router,
  product: products
}