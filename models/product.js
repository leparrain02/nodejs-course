const Cart = require('./cart');
const db = require('../util/database');


module.exports = class Product {
  constructor(id, title, imageUrl, price, description){
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  };

  save(){
    if(this.id == null){
      return db.execute('INSERT INTO products (title, imageUrl, price, description) VALUES(?,?,?,?)',[
        this.title,
        this.imageUrl,
        this.price,
        this.description  
      ]);
    } else {
      return db.execute('UPDATE products SET title=?, imageUrl=?, price=?, description=? WHERE id=?',[
        this.title,
        this.imageUrl,
        this.price,
        this.description,
        this.id
      ]);
    }
  };

  static fetchAll(){ 
    return db.execute('SELECT * FROM products');
  };

  static findById(id){
    return db.execute('SELECT * FROM products where id=?',[id]);
  };

  static deleteById(id){
  
  };
  
 }