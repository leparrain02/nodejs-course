const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');

module.exports = class Cart {
  static addCart(id,productPrice,cb){
    fs.readFile(p,(err, data) => {
      let cart = {product: [], totalPrice: 0};
      if(!err){
         cart = JSON.parse(data);
      }
      const productIndex = cart.product.findIndex(prod => prod.id === id);
      if(productIndex != -1){
        const product = _.get(cart,`product[${productIndex}]`);
        product.qty++;
        _.set(cart,`product[${productIndex}]`,product);
        cart.totalPrice += +productPrice;
      } else {
        cart.product.push({id: id, qty: 1});
        cart.totalPrice += +productPrice;
      }
      fs.writeFile(p,JSON.stringify(cart), (err) => {
        if(err){
            console.log(err);
        }
        cb();
      });
    });
  };

  static removeCart(id,productPrice,cb){
    fs.readFile(p,(err, data) => {
      if(err){
        return cb();
      }
      const updatedProducts = JSON.parse(data);
      const productQty = _.get(updatedProducts.product.find(prod => prod.id === id),'qty');
       
      updatedProducts.product = updatedProducts.product.filter(prod => prod.id !== id);
      updatedProducts.totalPrice = updatedProducts.totalPrice - productPrice * productQty;

      fs.writeFile(p,JSON.stringify(updatedProducts), (err) => {
        if(err){
            console.log(err);
        }
        cb();
      });

    });
  };

  static getCart(cb){
    fs.readFile(p,(err, data) => {
      if(err){
        cb(null);
      } else {
        cb(JSON.parse(data));
      }
    });
  };
}