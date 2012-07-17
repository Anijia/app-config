var config = require('../config'),
    App = require('../models/app'),
    Api = require('../lib/api'),
    objectUtil = require('../lib/object-util'),
    async = require('async');

/*
 * GET home page.
 */


exports.index = function(req, res){
  App.getAll(function(err, rows) {
    res.render('index', {
        siteTitle: config.site.title,
        pageTitle: config.site.title,
        apps: rows
    });
  });
};

exports.appCreateForm = function(req, res){
  res.render('app/create', {
    siteTitle: config.site.title,
    pageTitle: '创建APP'
  });
};

exports.appCreate = function(req, res){
  var appData = req.body.app;

  App.create(appData, function(err, rows) {
    res.redirect('/app/' + appData.id);
  });
};

exports.app = function(req, res){
  var appId = req.params.id;

  async.auto({
    getRecommended: function(callback) {
      App.recommend.getRecommended(appId, callback);
    },

    getApp: function(callback) {
      App.getById(appId, callback);
    },

    getUnrecommended: ['getApp', function(callback, data) {
      var app = data.getApp,
          params = {
            platform: app.platform
          };

      App.getByCondition(params, function(err, unrecommendedApps) {
        if (err) return callback(err);
        callback(null, unrecommendedApps);
      });
    }]}, function(err, data) {
      var app = data.getApp,
          data = {
            siteTitle: config.site.title,
            pageTitle: app.title,
            recommendedApps: data.getRecommended,
            apps: data.getUnrecommended,
            appId: appId,
            device: app.device,
            platform: app.platform
          };

      res.render('app/edit', data);
    });
};

exports.getConfig = function(req, res) {
  App.recommend.getRecommended(req.params.appId, function(err, data) {
    res.send(data);
  });
};

exports.api = function(req, res) {
  var params,
      apiName = req.params[0];

  params = objectUtil.extend({}, req.query, req.body);
  Api.call(apiName, params, function(err, data) {
    res.send(data);
  });
};
