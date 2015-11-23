'use strict';
var log     = require('../../lib/logger');
var Promise = require('bluebird');
var User    = require('../../models/user');

exports.user = {
  register: function (data) {

    return new Promise(function (resolve, reject) {

      return User.findOne({'email': data.useremail}, function (err, user) {
        //log.debug(user);
        if (err) {
          log.error(err);
          return reject({success: false, extras: {message: 'Some error on register user', info: err}});
        }

        if (!user) {
          //log.info(data);
          return resolve(data);
        } else {
          return reject({success: false, extras: {message: 'Some error on register user'}});
        }

      });

    })
      .then(function (userData) {
        log.info(userData);
        var newUser = User({
          name : userData.username,
          email: userData.useremail
        });

        newUser.createHash(userData.pass);

        return newUser.save(function (err, user, numAffected) {
          if (err) {
            log.error(err);
            return Promise.reject({success: false, extras: {message: 'Email already exist', info: err}});
          }
          if (numAffected === 1) {
            log.info('registed');
            return Promise.resolve({success: true, extras: {message: 'created successful'}});
          }
        });
      })
      .catch(function (err) {
        log.error(err);
        return Promise.reject({success: false, extras: {message: 'Error on creating user', info: err}});
      });

  }
};