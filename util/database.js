const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

exports.MongoConnect = cb => {  
  MongoClient.connect('mongodb://node-rw:qaz1234@localhost:27017/node_course?authSource=admin',{ useUnifiedTopology: true },(err, client) => {
    if(err){
      console.log(err);
      throw err;
    }
    console.log('Connected');
    _db=client.db();
    cb();
  });
};

exports.getDb = () => {
  if(_db){
    return _db;
  }
  throw 'DB not define';
};