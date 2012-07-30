var dbConn = require('../../lib/mysql').connection;

var app = {
  create: function(data, callback) {
    dbConn.query('insert into app(id, platform, device, name) values (?, ?, ?, ?)', [data.id, data.platform, data.device, data.name], callback);
  },

  update: function(data, callback) {
    dbConn.query('update app set platform = ?, device = ?, name = ? where id = ?', [data.platform, data.device, data.name, data.id], callback);
  },

  del: function(data, callback) {
    dbConn.query('delete from app where id = ?', [data.id], callback);
  },

  getRowById: function(id, callback) {
    dbConn.query('select * from app where id = ?', [id], function(err, rows) {
      callback(err, !err && rows.length && rows[0]); 
    });
  },

  getAllRows: function(callback) {
    dbConn.query('select * from app', function(err, rows) {
      callback(err, rows); 
    });
  },

  getByCondition: function(conditions, callback) {
    var sql = 'select * from app where ', params = [],
        key, val,
        whereList = [];

    for (key in conditions) {
      val = conditions[key];
      whereList.push('`' + key + '`= ?');
      params.push(val);
    }

    sql += whereList.join(' and ');
    dbConn.query(sql, params, function(err, rows) {
      callback(err, rows); 
    });
  }
};

app.recommend = require('./recommend');

module.exports = app;
