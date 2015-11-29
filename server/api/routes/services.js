'use strict';

var log         = require('../../lib/logger');
var codify      = require('../../lib/codifyData');
var config      = require('config');
var ErrResponse = require('../../errors/responses');

var service = require('../controllers/services');

module.exports = function (app) {
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
          log.info('service removed', result);
          res.json(result);
        }).catch(function (err) {
          log.error(err);
          res.json(err);
        });
    }
  });

  app.post('/api/services/get-settings', function (req, res) {

    if (req.body.userId) {

      service.getServiceSettings(req.body.userId, req.body.serviceId).then(function (data) {
        //log.debug(data);
        res.json(data);
      }).catch(function (err) {
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