const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getListProducts = (req,res,next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list',{prods: products, pageTitle: 'Products list', path: '/products'});
  });
};

exports.getProduct = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id,product => {
    res.render('shop/product-detail',{pageTitle: product.title, product: product, path: '/products'});
  }); 
};

exports.getIndex = (req,res,next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/index',{prods: products, pageTitle: 'My Shop', path: '/'});
  });
};

exports.getCart = (req,res,next) => {
  res.render('shop/cart',{pageTitle: 'Your Cart', path: '/cart'});
};

exports.postCart = (req,res,next) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    Cart.addCart(id,product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req,res,next) => {
  res.render('shop/orders',{pageTitle: 'Your Orders', path: '/orders'});
};

exports.getCheckout = (req,res,next) => {
  res.render('shop/checkout',{pageTitle: 'Checkout', path: '/checkout'});
};