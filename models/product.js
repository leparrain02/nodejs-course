const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true 
  },
  price: {
    type: Number,
    required: true 
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product',productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, imageUrl, price, description,id,userId){
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = new mongodb.ObjectId(userId);

//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//       console.log(`Update: ${this._id}`);
//       dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//     .catch(err => {
//       console.log(err);
//     });

//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray()
//     .then(products => {
//       return products;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('products').findOne({_id: new mongodb.ObjectId(id)})
//     .then(product => {
//       return product;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
//     .catch(err => {
//       console.log(err);
//     })
//   }
// }

// module.exports = Product;