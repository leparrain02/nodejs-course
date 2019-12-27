const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getListProducts = (req,res,next) => {
  Product.fetchAll()
  .then(([rows,fetchData]) => {
    res.render('shop/product-list',{prods: rows, pageTitle: 'Products list', path: '/products'});
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  })
};

exports.getProduct = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id,product => {
    res.render('shop/product-detail',{pageTitle: product.title, product: product, path: '/products'});
  }); 
};

exports.getIndex = (req,res,next) => {
  res.render('shop/index',{pageTitle: 'My Shop', path: '/'});
};

exports.getCart = (req,res,next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products =>{
      const productsCart = [];
      for(item of cart.product){
        product = products.find( prod => prod.id === item.id);
        productsCart.push({product: product, qty: item.qty});
      }
      res.render('shop/cart',{pageTitle: 'Your Cart', path: '/cart', products: productsCart});
    });
  });
};

exports.postCart = (req,res,next) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    Cart.addCart(id,product.price,() => {
      res.redirect('/cart');
    });
  });
};

exports.postCartDeleteItem = (req,res,next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.removeCart(productId,product.price,() => {
      res.redirect('/cart');
    })
  });
};

exports.getOrders = (req,res,next) => {
  res.render('shop/orders',{pageTitle: 'Your Orders', path: '/orders'});
};

exports.getCheckout = (req,res,next) => {
  res.render('shop/checkout',{pageTitle: 'Checkout', path: '/checkout'});
};