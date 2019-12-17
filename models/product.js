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
  constructor(title){
    this.title = title;
  }

  save(){
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
 }