const Product = require('../models/product');


exports.getListProducts = (req,res,next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list',{prods: products, pageTitle: 'Products list', path: '/products'});
  });

};

exports.getIndex = (req,res,next) => {
  res.render('shop/index',{pageTitle: 'My Shop', path: '/'});
}

exports.getCart = (req,res,next) => {
  res.render('shop/cart',{pageTitle: 'Your Cart', path: '/cart'});
}

exports.getOrders = (req,res,next) => {
  res.render('shop/orders',{pageTitle: 'Your Orders', path: '/orders'});
}

exports.getCheckout = (req,res,next) => {
  res.render('shop/checkout',{pageTitle: 'Checkout', path: '/checkout'});
}