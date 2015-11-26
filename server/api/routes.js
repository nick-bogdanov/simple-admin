'use strict';

var log    = require('../lib/logger');
var codify = require('../lib/codifyData');
var config = require('config');

module.exports = function (app) {

  var auth    = require('./controllers/users');
  var service = require('./controllers/services');

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

    auth.user.register(req.body).then(function (data) {

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

    auth.user.login(req.body).then(function (response) {
      var token         = codify.encrypt(response.extras.id.toString(), config.get('secret.id'));
      req.session.token = token;

      res.json({success: true, extras: {message: 'Authorized', token: token}});
    });

  });


  app.post('/api/authorized', function (req, res) {

    if (!req.session.token) {
      log.info('token is not exist');
      return res.json({success: false, extras: {message: 'User is not authorized'}});
    }

    if (req.headers.token) {
      auth.user.findUserById(codify.decrypt(req.headers.token.toString(), config.get('secret.id'))).then(function (data) {
        log.info(data);
        res.json({authorized:true, message: data});
      }).catch(function (err) {
        log.error(err);
        res.json(err);
      });
    }else{
      res.json({authorized:false, extras: {message:'user is not authorized yet'}});
    }

  });

  app.post('/api/logout', function (req, res) {

    req.session.destroy(function (err) {
      log.debug(err);
      res.json({message: 'session destroyed'});
    });

  });

  app.post('/api/services/create', function (req, res) {

    if (req.session.token) {

      var id = codify.decrypt(req.body.token, config.get('secret.id'));

      auth.user.findUserById(id)
        .then(function () {
          service.createService(id, req.body).then(function (data) {
            log.info('service created:', data);
            res.json({success: true, extras: {message: 'service created'}});
          });
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

  });

  app.post('/api/services/get-services', function(req, res) {

    if (req.session.token) {

      var id = codify.decrypt(req.body.token, config.get('secret.id'));

      auth.user.findUserById(id)
        .then(function() {
          service.getServices(id).then(function(data) {
            log.info(data);
            res.json({success: true, extras: {message: 'data fetched', services: data.extras.data}});
          });
        })
        .catch(function(err) {
          log.error(err);
          res.json(err);
        });

    }

  });

};
