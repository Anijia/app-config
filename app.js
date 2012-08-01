
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({uploadDir: __dirname + '/public' + config.site.upload_dir}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/app/create', routes.app.create);
app.get('/app/:id/edit', routes.app.edit);
app.get('/app/:id/config', routes.app.config);
app.post('/app', routes.app.save);

app.get('/app/:appId/recommend/create', routes.recommend.create);
app.get('/app/:appId/recommend/:id/edit', routes.recommend.edit);
app.post('/recommend', routes.recommend.save);

app.get(/\/api\/(.*)/, routes.api);
app.post(/\/api\/(.*)/, routes.api);

app.get('/dma/:platform/:device/:appId/app.json', routes.getConfig);

app.listen(config.server.port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
