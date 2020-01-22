const Product = require('../models/product');


exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description,null,req.user._id);

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
  .then(products => {
    res.render('admin/products',{
      prods: products, 
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
  .then(product => {
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product', 
      product: product, 
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
  const product = new Product(title, imageUrl, price, description, id);

  return product.save()
  .then(result => res.redirect('/admin/products'))
  .catch(err =>{
    console.log(err);
    res.status(502).redirect('/');
  });
};

 exports.getDeleteProducts = (req,res,next) => {
  const id = req.params.productId;

  Product.deleteById(id)
  .then(result => res.redirect("/admin/products"))
  .catch(err => {
    console.log(err);
    res.redirect('/');
  })
 };