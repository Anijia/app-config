var mysql = require('mysql')
  , config = require('../config')
  , mysqlConfig = config.db
  , connection = mysql.createConnection(mysqlConfig)

connection.on('error', function(err) {
  console.error('Mysql client Error: ' + err.message);
  client.end();
});

exports.connection = connection;
