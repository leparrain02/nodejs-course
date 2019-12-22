const Product = require('../models/product');

exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageURL, price, description);
  product.save();
  res.redirect('/admin/products');
};

exports.getAddProducts = (req,res,next) => {
  res.render('admin/edit-product',{
    pageTitle: 'Add Product', 
    editing: false,
    path: '/admin/add-product'
  });
};

exports.getProducts = (req,res,next) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Product', 
      path: '/admin/products'
    });
  });

};

exports.getEditProducts = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id, product => {
    if(!product){
      return res.status(502).redirect('/');
    }
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product', 
      product: product, 
      editing: true,
      path: '/admin/edit-product'
    });
  });
  
};

exports.postEditProducts = (req,res,next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id,title,imageURL,price,description);
  product.save();
  res.redirect('/admin/products');
};