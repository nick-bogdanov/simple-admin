'use strict';

var log         = require('../../lib/logger');
var codify      = require('../../lib/codifyData');
var config      = require('config');
var ErrResponse = require('../../errors/responses');

module.exports = function (app) {

  var auth = require('./../controllers/auth');

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

  app.post('/api/register', function (req, res) {

    auth.user.register(req.body).then(function (data) {
      log.debug(data);
      if (data._id) {
        log.info(data._id);
        var token         = codify.encrypt(data._id.toString(), config.get('secret.id'));
        req.session.token = token;

        return res.json({success: true, message: 'Регистрация прошла успешно.', token: token});
      } else {
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

      } else {
        throw ErrResponse.userNotExists();
      }

    }).catch(function (err) {
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

};

