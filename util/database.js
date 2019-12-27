const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'node_course',
  user: 'node-rw',
  password: 'qaz1234'
});

module.exports = pool.promise();