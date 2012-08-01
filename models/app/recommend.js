var dbConn = require('../../lib/mysql').connection,
    async = require('async');

var Recommend = {
  create: function(params, callback) {
    var app = params.app;
    dbConn.query('insert into recommended_app(appId, displayName, lIconUrl, hIconUrl, downloadUrl, _schema) values(?, ?, ?, ?, ?, ?)', [params.appId, app.displayName, app.lIconUrl, app.hIconUrl, app.downloadUrl, app._schema || null], callback);
  },

  update: function(data, callback) {
    var update = function(table, data, conditions, callback) {
      var sql = 'update ' + table + ' set';
      var i, params = [];
      var where = [], whereParams = [];

      for (i in data) {
        if (~conditions.indexOf(i)) {
          where.push(i + ' = ?');
          whereParams.push(data[i]);
        } else {
          sql += ' ' + i + ' = ?,';
          params.push(data[i]);
        }
      }
      sql = sql.slice(0, -1);

      if (where.length > 0) {
        sql += ' where ' + where.join(' and ');
        params = params.concat(whereParams);
      }

      dbConn.query(sql, params, callback);
    };
    
    update('recommended_app', data.app, ['id'], callback);
  },

  getRowById: function(id, callback) {
    dbConn.query('select * from recommended_app where id = ?', [id], function(err, rows) {
      callback(err, !err && rows.length && rows[0]); 
    });
  },

  del: function(params, callback) {
    dbConn.query('delete from recommended_app where id = ? and appId = ?', [params.recommendAppId, params.appId], callback);
  },

  getRecommended: function(id, callback) {
    dbConn.query('select * from recommended_app where appId = ?', [id], callback);
  }
};

module.exports = Recommend;
