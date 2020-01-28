const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

UserSchema.methods.addToCart = function(productId){
    const cartIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === productId.toString();
    });

    const updatedCart = this.cart;
    if(cartIndex >= 0){
        updatedCart.items[cartIndex].quantity += 1;
    } else {
        updatedCart.items.push({productId: productId, quantity: 1});
    }

    this.cart = updatedCart;
    return this.save();
    
};

UserSchema.methods.deleteProductFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = updatedCartItems;
    return this.save();

};

UserSchema.methods.clearCart = function(){
    this.cart.items = [];
    return this.save();
};

module.exports = mongoose.model('User',UserSchema);



// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//     constructor(username,email, cart, id){
//       this.username = username;
//       this.email = email;
//       this.cart = cart ? cart : {items: []};
//       this._id = id;
//     }

//     save(){
//       const db = getDb();

//       return db.collection('users').insertOne(this)
//       .then(result => {
//           console.log('User Inserted');
//       })
//       .catch(err => {
//           console.log(err);
//       });
//     }

//     static findById(id){
//       const db = getDb();

//       return db.collection('users').findOne({_id: new mongodb.ObjectId(id)})
//       .then(user => {
//           return user;
//       })
//       .catch(err => {
//           console.log(err);
//       });
//     }

//     addToCart(productId){
//       const cartIndex = this.cart.items.findIndex(item => {
//         return item._id.toString() === productId.toString();
//       });

//       const updatedCart = this.cart;
//       if(cartIndex >= 0){
//         updatedCart.items[cartIndex].quantity += 1;
//       } else {
//         updatedCart.items.push({_id: new mongodb.ObjectId(productId), quantity: 1});
//       }

//       const db = getDb();
//       return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: updatedCart}})
//       .catch(err => {
//         console.log(err);
//       });
//     }

//     getCart(){
//       const db = getDb();
//       const productIds = this.cart.items.map(i => {
//         return i._id;
//       });
      
//       return db.collection('products').find({_id: {$in: productIds}}).toArray()
//       .then(products => {
//           return products.map(p => {
//             return {
//               ...p,
//               quantity: this.cart.items.find(i => {
//                 return i._id.toString() === p._id.toString();
//               }).quantity
//             };
//           });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     }

//     deleteProductFromCart(productId){
//       const updatedCartItems = this.cart.items.filter(item => {
//         return item._id.toString() !== productId.toString();
//       });

//       const db = getDb();
//       return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: {items: updatedCartItems}}})
//       .catch(err => {
//         console.log(err);
//       });
//     }

//     addOrder(){
//       const db = getDb();
//       return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart.items = [];
//         return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: {items: []}}});
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     }

//     getOrders(){
//       const db = getDb();
//       return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray();
//     }
// }

// module.exports = User;