var config = require('../config'),
    App = require('../models/app'),
    Api = require('../lib/api'),
    objectUtil = require('../lib/object-util');

/*
 * GET home page.
 */


exports.index = function(req, res){
  App.getAllRows(function(err, rows) {
    res.render('index', {
        siteTitle: config.site.title,
        pageTitle: config.site.title,
        apps: rows
    });
  });
};


exports.getConfig = function(req, res) {
  App.recommend.getRecommended(req.params.appId, function(err, data) {
    var result = data.map(function(item, i) {
      var i, result = {};

      var replaceMap = {
        _schema: 'schema'
      };

      var excludedMap = {
        appId: 1
      };

      var prefixMap = {
        lIconUrl: config.site.base_uri,
        hIconUrl: config.site.base_uri
      };

      for (i in item) {
        if (i in excludedMap) continue;
        if (i in prefixMap) {
          result[i] = prefixMap[i] + item[i];  
        } else if (i in replaceMap) {
          result[replaceMap[i]] = item[i];
        } else {
          result[i] = item[i];
        }
      } 
      return result;
    });
    res.send(result);
  });
};

exports.api = function(req, res) {
  var params,
      apiName = req.params[0];

  params = objectUtil.extend({}, req.query, req.body);
  Api.call(apiName, params, function(err, data) {
    if (err) return res.send(err, 500);
    res.send(data);
  });
};

exports.app = require('./app');
exports.recommend = require('./recommend');
