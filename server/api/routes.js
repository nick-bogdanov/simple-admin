'use strict';

var log    = require('../lib/logger');
var codify = require('../lib/codifyData');
var config = require('config');

module.exports = function (app) {

  var auth    = require('./controllers/users');
  var service = require('./controllers/services');

  //session check
  app.use(function (req, res, next) {
    
    if (req.headers.token && req.session.token) {

      var id = codify.decrypt(req.headers.token, config.get('secret.id'));

      auth.user.findUserById(id)
        .then(function () {
          req.body.userId = id;
        })
        .catch(function () {
          req.body.userId = false;
        })
        .finally(function () {
          next();
        });
    } else {
      req.body.userId = false;
      next();
    }

  });

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

    if (req.body.userId) {
      log.info('User authorized');
      res.json({authorized: true});
    } else {
      log.info('User not authorized');
      res.json({authorized: false, extras: {message: 'user is not authorized yet'}});
    }

  });

  app.post('/api/logout', function (req, res) {

    req.session.destroy(function (err) {
      log.debug(err);
      res.json({message: 'session destroyed'});
    });

  });

  app.post('/api/services/create', function (req, res) {

    if (req.body.userId) {

      return service.createService(req.body.userId, req.body)
        .then(function (data) {
          log.info('service created:', data);
          res.json({success: true, extras: {message: 'service created'}});
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

    return res.json({success: false, extras: {message: 'error'}});

  });

  app.post('/api/services/get-services', function (req, res) {

    if (req.body.userId) {

      service.getServices(req.body.userId)
        .then(function (data) {
          res.json({success: true, extras: {message: 'data fetched', services: data.extras.data}});
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

  });

  app.post('/api/services/removeService', function (req, res) {
    if (req.body.userId) {
      service.removeService(req.body.id)
        .then(function (res) {
          log.info(res);
          res.json(res);
        }).catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }
  });

};
