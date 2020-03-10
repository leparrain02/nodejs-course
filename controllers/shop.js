const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  
  Order.findById(orderId)
  .then(order =>{
      if(!order){
        return next(new Error('Order not found'));
      }
      if(order.user.userId.toString() !== req.user._id.toString()){
        return next(new Error('Unauthorize'));
      }
      const invoiceFile = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data','invoices',invoiceFile);

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);

      res.setHeader('Content-Type','application/pdf');
      res.setHeader('Content-Disposition','inline; filename="' + invoiceFile + '"');

      doc.fontSize(20).text('INVOICE',50,50);
      doc.fontSize(16).text(`# ${orderId}`,50,70,{bold: true});
      let totalPrice=0;
      let y=150;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        doc.fontSize(14).text(prod.product.title,60,y);
        doc.fontSize(14).text(prod.quantity,350,y);
        doc.fontSize(14).text('$ ' + prod.product.price,400,y);
        y += 20;
      });
      doc.fontSize(16).text('Item',60,120,{bold: true});
      doc.fontSize(16).text('Qty',340,120,{bold: true});
      doc.fontSize(16).text('Cost',400,120,{bold: true});
      doc.moveTo(50,110).lineTo(475,110).stroke();
      doc.moveTo(50,140).lineTo(475,140).stroke();
      doc.moveTo(50,y).lineTo(475,y).stroke();
      doc.moveTo(50,110).lineTo(50,y).stroke();
      doc.moveTo(325,110).lineTo(325,y).stroke();
      doc.moveTo(375,110).lineTo(375,y+30).stroke();
      doc.moveTo(475,110).lineTo(475,y+30).stroke();
      doc.moveTo(375,y+30).lineTo(475,y+30).stroke();
      doc.fontSize(16).text('Total Price:',50,y+10);
      doc.fontSize(16).text('$ ' + (Math.round(totalPrice*Math.pow(10,2))/Math.pow(10,2)).toFixed(2),400,y+10);
      doc.end();

  })
  .catch(err => {
    next(err);
  })
};

