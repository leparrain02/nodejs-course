const path = require('path');
const fs = require('fs');

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
  constructor(title, imageURL, price, description){
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save(){
    this.id = Math.random().toString();
    readDataFile(products => {
      products.push(this);
      fs.writeFile(p,JSON.stringify(products),(err) => {
        if(err){
          console.log(err);
        }
      });
    });
   
  }

  static fetchAll(cb){ 
    readDataFile(cb); 
  }

  static findById(id,cb){
    readDataFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
  
 }