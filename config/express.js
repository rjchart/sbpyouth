var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var azure = require('azure-storage');
var multiparty = require('multiparty');
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));

  /* custom code */
  // app.use('/image', express.static(config.root + '/images'));
  // app.use('/css', express.static(config.root + "/css"));
  // app.use('/lib', express.static(config.root + "/lib"));
  // app.use('/sample_css', express.static(config.root + "/sample/css"));
  // app.use('/js', express.static(config.root + "/sample/js"));
  // app.use('/images', express.static(config.root + "/sample/images"));
  // app.use('/html', express.static(config.root + "/html"));
  app.use('/public/img', express.static(config.root + "/public/img"));
  app.use('/semantic/dist', express.static(config.root + "/semantic/dist"));
  app.use('/node_modules', express.static(config.root + "/node_modules"));
  app.use('/javascript', express.static(config.root + "/javascript"));
  app.use('/app/views', express.static(config.root + "/app/views"));
  /* custom code */

  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
