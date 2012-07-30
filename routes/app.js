var config = require('../config'),
    App = require('../models/app'),
    async = require('async');

var app = module.exports = {
  create: function(req, res) {
    res.render('app/item', {
      siteTitle: config.site.title,
      pageTitle: '创建APP',
      action: 'create'
    });
  },

  edit: function(req, res) {
    var id = req.params.id;

    App.getRowById(id, function(err, row) {
      res.render('app/item', {
        siteTitle: config.site.title,
        pageTitle: '编辑APP',
        app: row,
        action: 'update'
      });
    });
  },

  save: function(req, res) {
    var data = req.body;
    App[data.action](data.app, function(err, rows) {
      res.redirect('/');
    });
  },

  config: function(req, res) {
    var appId = req.params.id;

    async.parallel([
      function(callback) {
        App.getRowById(appId, callback);
      },

      function(callback) {
        App.recommend.getRecommended(appId, callback);
      }],
      
      function(err, results) {
        var app = results[0],
            recommendedApps = results[1][0],
            data = {
              siteTitle: config.site.title,
              pageTitle: '配置 ' + app.name,
              recommendedApps: recommendedApps,
              app: app
            };
        res.render('app/config', data);
      }
    );
  }
};
