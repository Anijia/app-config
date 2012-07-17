var dbConn = require('../../lib/mysql').connection,
    async = require('async');

var Recommend = {
  add: function(params, callback) {
    dbConn.query('insert into appRecommend(sourceId, targetId) values(?, ?)', [params.sourceId, params.targetId], callback);
  },

  del: function(params, callback) {
    dbConn.query('delete from appRecommend where sourceId = ? and targetId = ?', [params.sourceId, params.targetId], callback);
  },

  getRecommendedList: function(id, callback) {
    dbConn.query('select * from appRecommend where sourceId = ?', [id], callback);
  },

  getRecommended: function(id, callback) {
    async.waterfall([
      function(callback) {
        Recommend.getRecommendedList(id, callback);
      },
      function(relationList, metadata, callback) {
        var len = relationList.length,
            appList = [];

        if (len == 0) return callback(null, appList);

        relationList.forEach(function(relation, i) {
          dbConn.query('select * from app where id = ?', [relation.targetId], function(err, rows) {
            if (err) return callback(err);
            appList = appList.concat(rows);
            --len || callback(null, appList); 
          });
        });
      }
    ], callback);
  },

  getUnrecommended: function(id, callback) {
    async.waterfall([
      function(callback) {
        Recommend.getRecommendedList(id, callback);
      },
      function(relationList, metadata, callback) {
        var idList = [];

        relationList.forEach(function(relation, i) {
          idList.push(relation.targetId);
        });

        var sql = 'select * from app';
        if (relationList.length > 0) { 
          sql += ' where id not in (';
          if (idList.length > 1) {
            sql += new Array(idList.length).join('?,');
            sql = sql.slice(0, -1);
          } else {
            sql += '?';
          }
          sql += ')';
        } 

        dbConn.query(sql, idList, callback);
      }
    ], callback);
  }
};

module.exports = Recommend;
