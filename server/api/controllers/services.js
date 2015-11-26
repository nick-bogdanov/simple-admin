'use strict';
var log     = require('../../lib/logger');
var Promise = require('bluebird');
var User    = require('../../models/user');

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
        return reject(err);
      }

      if (num.ok) {
        return resolve({success: true});
      }

      return reject({success: false});

    });

  });
};

exports.getServices = function(id) {

  return new Promise(function(resolve, reject) {
    return User.findOne({_id: id}, function(err, user) {
      if (err) {
        log.error(err);
        return reject(err);
      }

      if (user) {
        log.debug(user);
        return resolve({succes: true, extras: {message: 'user list fetched', data: user.services}});
      }else{
        log.error('user not finded');
        return reject({success:false, extras: {message: 'user not exist'}});
      }

    });
  });

};