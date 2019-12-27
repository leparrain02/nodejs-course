const Product = require('../models/product');

exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageUrl, price, description);
  product.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
    res.status(502).redirect('/');
  });
};

exports.getAddProducts = (req,res,next) => {
  res.render('admin/edit-product',{
    pageTitle: 'Add Product', 
    editing: false,
    path: '/admin/add-product'
  });
};

exports.getProducts = (req,res,next) => {
  Product.fetchAll()
  .then(([rows,fetchData]) => {
    res.render('admin/products',{
      prods: rows, 
      pageTitle: 'Admin Product', 
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getEditProducts = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id)
  .then(([product]) => {
//    if(product.length() == 0){
//      return res.status(502).redirect('/');
//    }
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product', 
      product: product[0], 
      editing: true,
      path: '/admin/edit-product'
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(502).redirect('/');
  });
  
};

exports.postEditProducts = (req,res,next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id,title,imageUrl,price,description);
  product.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err =>{
    console.log(err);
    res.status(502).redirect('/');
  });
};

exports.getDeleteProducts = (req,res,next) => {
  const id = req.params.productId;

  Product.deleteById(id,() => {
    res.redirect("/admin/products");
  });
};