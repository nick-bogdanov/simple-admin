'use strict';

var log    = require('../lib/logger');
var codify = require('../lib/codifyData');
var config = require('config');

module.exports = function (app) {

  var api = require('./controllers/users');

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/views/:name', function (req, res) {
    res.render(req.params.name);
  });

  app.get('/views/:path/:name', function (req, res) {
    res.render(req.params.path + "/" + req.params.name);
  });


  app.post('/api/register', function (req, res) {

    api.user.register(req.body).then(function (data) {

      if (data) {
        var token         = codify.encrypt(data._id.toString(), config.get('secret.id'));
        req.session.token = token;
        log.info(req.session.token);
        return res.json({success: true, extras: {message: 'Регистрация прошла успешно.', info: token}});
      }

      throw new Error('Cant register');

    }).catch(function (err) {
      log.error(err);
      res.json({success: false, extras: {message: 'User exist. Try again', info: err}});
    });

  });

  //app.post('/api/login', function (req, res) {
  //  //res.redirect('/');
  //});


  app.post('/api/authorized', function (req, res) {
    log.debug(req.session.token);
    if (!req.session.token) {
      log.info('token is not exist');
      return res.json({success: false, extras: {message: 'User is not authorized'}});
    }

    api.user.getUserById(codify.decrypt(req.body.token.toString(), config.get('secret.id'))).then(function (data) {
      log.info(data);
      //log.info(data);
      res.json({message: data});
    }).catch(function(err) {
      log.error(err);
    })

  });
};
