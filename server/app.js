"use strict";

var express        = require('express');
var app            = express();
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var config         = require('config');
var log            = require('./lib/logger');
var sessionOptions = config.get("session");
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);

sessionOptions.store = new MongoStore({mongooseConnection: mongoose.connection});

// view engine setup
app.set('views', path.join(__dirname, config.get('public.views')));
app.set('view engine', config.get('app.viewEngine'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session(sessionOptions));

app.use(express.static(path.join(__dirname, config.get('public.static'))));

require('./api/routes')(app);

mongoose.connect(config.get('db'));

mongoose.connection.on('error', function (err) {
  log.error('mongoose error: ', err);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err    = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error  : err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error  : {}
  });
});


module.exports = app;
