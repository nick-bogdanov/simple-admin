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
          idp  : data.idp
        }
      }
    }, function (err, num) {
      if (err) {
        log.error(err);
        return reject(ErrResponse.dataError({info: err}));
      }

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