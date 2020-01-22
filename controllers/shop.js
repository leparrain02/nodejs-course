const Product = require('../models/product');


exports.getListProducts = (req,res,next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list',{
      prods: products, 
      pageTitle: 'Products list', 
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  })
};

exports.getProduct = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id)
  .then( product => {
    res.render('shop/product-detail',{
      pageTitle: product.title, 
      product: product, 
      path: '/products'});
  })
  .catch(err => {
      console.log(err);
      res.status(502).redirect('/');
  }); 
};

exports.getIndex = (req,res,next) => {
  res.render('shop/index',{pageTitle: 'My Shop', path: '/'});
};

exports.getCart = (req,res,next) => {
  req.user.getCart()
  .then(products => {
    res.render('shop/cart',{pageTitle: 'Your Cart', path: '/cart', products: products});
  })
  .catch(err => {console.log(err)});
  
};

exports.postCart = (req,res,next) => {
  const id = req.body.productId;
  return req.user.addToCart(id)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCartDeleteItem = (req,res,next) => {
  const productId = req.body.productId;
  req.user.deleteProductFromCart(productId)
  .then( result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCreateOrder = (req,res,next) => {
  req.user.addOrder()
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getOrders = (req,res,next) => {
  req.user.getOrders()
  .then(orders => {
    res.render('shop/orders',{
      pageTitle: 'Your Orders', 
      path: '/orders',
      orders: orders
    });
  })
  .catch(err => {
    console.log(err);
  });
};
