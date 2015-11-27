'use strict';
var log         = require('../../lib/logger');
var Promise     = require('bluebird');
var User        = require('../../models/user');
var ErrResponse = require('../../errors/responses');

exports.createService = function (id, data) {

  return new Promise(function (resolve, reject) {

    return User.update({
      _id: id
    }, {
      $push: {
        services: {
          login: data.login,
          idp  : data.idp,
          options: {
            currentBalance: 0
          }
        }
      }
    }, function (err, num) {
      if (err) {
        log.error(err);
        return reject(ErrResponse.dataError({info: err}));
      }
      log.info(num);
      if (num.ok) {
        return resolve({success: true});
      }

      return reject(ErrResponse.dataError({info: {err: err, num: num}}));

    });

  });
};

exports.getServices = function (id) {

  return new Promise(function (resolve, reject) {
    return User.findOne({_id: id}, function (err, user) {
      if (err) {
        log.error(err);
        return reject(ErrResponse.dataError({info: err}));
      }

      if (user) {
        //log.debug(user);
        return resolve({succes: true, extras: {message: 'user list fetched', data: user.services}});
      } else {
        log.error('user not finded');
        return reject(ErrResponse.userExists({info: err}));
      }

    });
  });

};

exports.removeService = function (userId, serviceId) {
  return new Promise(function (resolve, reject) {

    return User.update({_id: userId}, {
      $pull: {
        services: {
          _id: serviceId
        }
      }
    }, function (err, numAffected) {

      if (err) {
        log.error(err);
        return reject(ErrResponse.dataError({info: err}));
      }

      if (numAffected.ok) {
        log.info(numAffected);
        return resolve({success: true});
      }

      return reject(ErrResponse.dataError({info: err}));

    });

  });
};

exports.getServiceSettings = function (_userId, serviceId) {

  return new Promise(function (resolve, reject) {
    return User.findOne({
      _id: _userId
    }, {
      services: {
        $elemMatch: {
          _id: serviceId
        }
      }
    }, function (err, user) {
      if (err) {
        return reject(ErrResponse.dataError({info: err}));
      }
      if (user) {
        return resolve({success: true, extras: {services: user.services[0]}});
      }

      return reject(ErrResponse.dataError({info: err}));

    });
  });

};

exports.updateSettings = function (id, data) {

  return new Promise(function (resolve, reject) {

    return User.update({
      "services._id": data._id
    }, {
      $set: {
        "services.$": data
      }
    }, function (err, num) {
      if (err) {
        log.error(err);
        return reject(ErrResponse.dataError({info: err}));
      }
      log.debug(num);
      if (num.ok) {
        return resolve({success: true});
      }

      return reject(ErrResponse.dataError({info: {err: err, num: num}}));

    });

  });
};

