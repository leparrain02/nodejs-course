const Product = require('../models/product');


exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  
  if(!image){
    return res.render('admin/edit-product',{
      pageTitle: 'Add Product', 
      editing: false,
      prodTitle: title,
      prodPrice: price,
      prodDescription: description,
      path: '/admin/add-product',
      errorMessage: 'The image is in a invalid format'
    });
  }

  const product = new Product({
    title: title, 
    imageUrl: `/${image.path}`, 
    price: price, 
    description: description,
    userId: req.user
  });

  product.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    next(new Error(err));
  });
};

exports.getAddProducts = (req,res,next) => {
  res.render('admin/edit-product',{
    pageTitle: 'Add Product', 
    editing: false,
    prodTitle: '',
    prodPrice: '',
    prodDescription: '',
    path: '/admin/add-product'
  });
};

exports.getProducts = (req,res,next) => {
  Product.find({userId: req.user._id})
  .then(products => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Product', 
      path: '/admin/products',
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
      prodId: id,
      prodTitle: product.title, 
      prodPrice: product.price,
      prodDescription: product.description,
      editing: true,
      path: '/admin/edit-product'
    });
  })
  .catch(err =>{
    next(new Error(err));
  });
  
};

exports.postEditProducts = (req,res,next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  
  Product.findById(id)
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/');
    }
    product.title = title;
    if(image){
      product.imageUrl = `/${image.path}`;
    }
    product.price = price;
    product.description = description;

    return product.save()  
    .then(result => res.redirect('/admin/products'))
    .catch(err =>{
      next(new Error(err));
    });
  })
  .catch(err =>{
    next(new Error(err));
  });
};

 exports.deleteProducts = (req,res,next) => {
  const id = req.params.productId;

  Product.deleteOne({_id: id, userId: req.user._id})
  .then(result => {
    res.status(200).json({message: "Success"});
  })
  .catch(err => {
    res.status(500).json({message: "Delete product failed"});
  })
 };