const path = require('path');
const fs = require('fs');

const Cart = require('./cart');


const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

const readDataFile = (cb) => {
  const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
  fs.readFile(p,(err,data) => {
    if(err){
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, price, description){
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  };

  save(){
    readDataFile(products => {
      if(this.id){
        const productIndex = products.findIndex(prod => prod.id === this.id);
        products[productIndex] = this;
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p,JSON.stringify(products),(err) => {
        if(err){
          console.log(err);
        }
      });
    });
  };

  static fetchAll(cb){ 
    readDataFile(cb); 
  };

  static findById(id,cb){
    readDataFile(products => {
      const product = products.find(prod => prod.id === id);
      cb(product);
    });
  };

  static deleteById(id){
    readDataFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p,JSON.stringify(updatedProducts), err => {
        if(err){
          console.log(err);
        } else {
           Cart.removeCart(id,product.price);
        }
      });
    });
  };
  
 }