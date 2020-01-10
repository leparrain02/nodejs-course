const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getListProducts = (req,res,next) => {
  Product.findAll()
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
  Product.findByPk(id)
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
  .then(cart =>{
    return cart.getProducts();
  })
  .then(products => {
    res.render('shop/cart',{pageTitle: 'Your Cart', path: '/cart', products: products});
  })
  .catch(err => {console.log(err)});
  
};

exports.postCart = (req,res,next) => {
  const id = req.body.productId;
  let fetchCart;
  let newQuantity = 1;

  req.user.getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts({where: {id: id}});
  })
  .then(products => {
    if(products.length > 0){
      const product = products[0];
      newQuantity = product.cartItem.quantity + 1;
      return product;
    }
    return Product.findByPk(id);
  })
  .then(product => {
    return fetchCart.addProduct(product,{through: {quantity: newQuantity}});
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCartDeleteItem = (req,res,next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: productId}});
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then( result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCreateOrder = (req,res,next) => {
  let fetchCart;
  req.user.getCart()
  .then(cart => {
    fetchCart=cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(
        products.map(product => {
          product.orderItem = {quantity: product.cartItem.quantity};
          return product;
      }));
    })
    .then(result =>{
      return fetchCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {console.log(err)});
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getOrders = (req,res,next) => {
  req.user.getOrders({include: ['products']})
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
