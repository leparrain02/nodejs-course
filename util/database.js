const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_course','node-rw','qaz1234',{
  dialect: 'mysql', 
  host: 'localhost'
});

module.exports = sequelize;