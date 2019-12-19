const Product = require('../models/product');

exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageURL, price, description);
  product.save();
  res.redirect('/admin/products');
};

exports.getAddProducts = (req,res,next) => {
  res.render('admin/add-product',{pageTitle: 'Add Product', path: '/admin/add-product'});
};

exports.getProducts = (req,res,next) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/products',{prods: products, pageTitle: 'Admin Product', path: '/admin/products'});
  });

};