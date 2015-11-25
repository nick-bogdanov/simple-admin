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

        return res.json({success: true, extras: {message: 'Регистрация прошла успешно.', token: token}});
      }

      throw new Error('Cant register');

    }).catch(function (err) {
      log.error(err);
      res.json({success: false, extras: {message: 'User exist. Try again', info: err}});
    });

  });

  app.post('/api/login', function (req, res) {

    api.user.login(req.body).then(function(response) {
      var token         = codify.encrypt(response.extras.id.toString(), config.get('secret.id'));
      req.session.token = token;

      res.json({success:true, extras: {message: 'Authorized', token: token}});
    });

  });


  app.post('/api/authorized', function (req, res) {

    if (!req.session.token) {
      log.info('token is not exist');
      return res.json({success: false, extras: {message: 'User is not authorized'}});
    }

    api.user.findUserById(codify.decrypt(req.body.token.toString(), config.get('secret.id'))).then(function (data) {
      log.info(data);
      res.json({message: data});
    }).catch(function (err) {
      log.error(err);
    });

  });

  app.post('/api/logout', function(req, res) {
    log.info(req.session);
    log.info(req.session.token);
    req.session.destroy(function(err) {
      log.debug(err);
    });
  });

};
