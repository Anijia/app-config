var App = require('../models/app'), 
    objectUtil = require('./object-util');

var apiList = {
  apps: function(callback) {
    App.getAll(callback);
  },

  'recommend/add': function(params, callback) {
    App.recommend.add(params, callback);
  },

  'recommend/del': function(params, callback) {
    App.recommend.del(params, callback);
  }
};

exports.call = function(apiName, params, callback) {
  var api = apiList[apiName],
      args = [];

  if (typeof callback == 'undefined') {
    args.push(params);
  } else {
    args.push(callback);
    if (!objectUtil.isEmptyObject(params))args.unshift(params);
  }

  if (typeof api == 'undefined') {
    return callback(new Error('Api not found'));
  }

  var fn = api.fn || api;
  fn.apply(api, args);
};

