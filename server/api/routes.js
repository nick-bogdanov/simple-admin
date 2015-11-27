'use strict';

var log    = require('../lib/logger');
var codify = require('../lib/codifyData');
var config = require('config');
var ErrResponse = require('../errors/responses');

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
      log.debug(data);
      if (data._id) {
        log.info(data._id);
        var token         = codify.encrypt(data._id.toString(), config.get('secret.id'));
        req.session.token = token;

        return res.json({success: true, message: 'Регистрация прошла успешно.', token: token});
      }else{
        throw ErrResponse.userExists();
      }
    }).catch(function (err) {
      log.error(err);
      res.json(err);
    });

  });

  app.post('/api/login', function (req, res) {

    auth.user.login(req.body).then(function (response) {
      if (response.success) {
        var token         = codify.encrypt(response.extras.id.toString(), config.get('secret.id'));
        req.session.token = token;
        res.json({success: true, message: 'Authorized', token: token});

      }else{
        throw ErrResponse.userNotExists();
      }

    }).catch(function(err) {
      log.error(err);
      res.json(err);
    });

  });


  app.post('/api/authorized', function (req, res) {

    if (req.body.userId) {
      log.info('User authorized');
      res.json({authorized: true});
    } else {
      log.info('User not authorized');
      res.json({authorized: false});
    }

  });

  app.post('/api/logout', function (req, res) {

    req.session.destroy(function (err) {
      log.debug(err);
      res.json({message: 'session destroyed'});
    });

  });

  app.post('/api/services/create-service', function (req, res) {

    if (req.body.userId) {
      log.debug(req.body.data);
      return service.createService(req.body.userId, req.body.data)
        .then(function (data) {
          log.info('service created:', data);
          res.json({success: true, message: 'service created'});
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

    return ErrResponse.userNotExists();

  });

  app.post('/api/services/get-services', function (req, res) {

    if (req.body.userId) {

      service.getServices(req.body.userId)
        .then(function (data) {
          res.json({success: true, message: 'data fetched', services: data.extras.data});
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

  });

  app.post('/api/services/removeService', function (req, res) {
    if (req.body.userId) {
      service.removeService(req.body.userId, req.body.id)
        .then(function (result) {
          log.info('service removed',result);
          res.json(result);
        }).catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }
  });

  app.post('/api/services/get-settings', function(req, res) {

    if (req.body.userId) {

      service.getServiceSettings(req.body.userId, req.body.serviceId).then(function(data) {
        log.debug(data);
        res.json(data);
      }).catch(function(err) {
        log.error(err);
        res.json(err);
      });

    }

  });

  app.post('/api/services/update-settings', function (req, res) {

    if (req.body.userId) {
      log.debug(req.body.data);
      return service.updateSettings(req.body.userId, req.body.data)
        .then(function (data) {
          log.info('service created:', data);
          res.json({success: true});
        })
        .catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }

    return ErrResponse.userNotExists();

  });

};

