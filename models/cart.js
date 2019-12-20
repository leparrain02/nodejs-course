const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');

module.exports = class Cart {
  static addCart(id,productPrice){
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
      });
    });
  };
}