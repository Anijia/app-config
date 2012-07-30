var config = require('../config'),
    App = require('../models/app'),
    ObjectUtil = require('../lib/object-util'),
    async = require('async');

var app = module.exports = {
  create: function(req, res) {
    var appId = req.params.appId;

    res.render('recommend/item', {
      siteTitle: config.site.title,
      pageTitle: '创建推荐APP',
      appId: appId,
      action: 'create'
    });
  },

  edit: function(req, res) {
    var recommendAppId = req.params.id;
    var appId = req.params.appId;

    App.recommend.getRowById(recommendAppId, function(err, row) {
      res.render('recommend/item', {
        siteTitle: config.site.title,
        pageTitle: '编辑APP',
        app: row,
        appId: appId,
        action: 'update'
      });
    });
  },

  save: function(req, res) {
    var data = ObjectUtil.extend({}, req.body);
    var i, file;

    for (i in req.files) {
      file = req.files[i];
      if (file.size == 0) continue;
      data.app[i] = config.site.upload_dir + '/' + file.path.split('\\').pop();
    }

    App.recommend[data.action](data, function(err, queryResult) {
      res.redirect('/app/' + data.appId + '/config');
    });
  }
};
