const Product = require('../models/product');
const Order = require('../models/order');


exports.getListProducts = (req,res,next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list',{
      prods: products, 
      pageTitle: 'Products list', 
      path: '/products',
      isAuthenticated: req.session.isLogged
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
      path: '/products',
      isAuthenticated: req.session.isLogged
    });
  })
  .catch(err => {
      console.log(err);
      res.status(502).redirect('/');
  }); 
};

exports.getIndex = (req,res,next) => {
  res.render('shop/index',{
    pageTitle: 'My Shop', 
    path: '/',
    isAuthenticated: req.session.isLogged
  });
};

exports.getCart = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    res.render('shop/cart',{
      pageTitle: 'Your Cart', 
      path: '/cart', 
      products: user.cart.items,
      isAuthenticated: req.session.isLogged
    });
  })
  .catch(err => {next(new Error(err));});
  
};

exports.postCart = (req,res,next) => {
  const id = req.body.productId;
  return req.user.addToCart(id)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    next(new Error(err));
  });
};

exports.postCartDeleteItem = (req,res,next) => {
  const productId = req.body.productId;
  req.user.deleteProductFromCart(productId)
  .then( result => {
    res.redirect('/cart');
  })
  .catch(err => {
    next(new Error(err));
  });
};

exports.postCreateOrder = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      return {quantity: i.quantity, product: {...i.productId._doc}}
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  }).then(() =>{
    res.redirect('/orders');
  })
  .catch(err => {
    next(new Error(err));
  });
}

exports.getOrders = (req,res,next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders',{
      pageTitle: 'Your Orders', 
      path: '/orders',
      orders: orders,
      isAuthenticated: req.session.isLogged
    });
  })
  .catch(err => {
    next(new Error(err));
  });
};

