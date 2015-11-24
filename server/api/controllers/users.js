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
            log.info('registered');
            return Promise.resolve({success: true, extras: {message: 'created successful'}});
          }
        });
      })
      .catch(function (err) {
        log.error(err);
        return Promise.reject({success: false, extras: {message: 'Error on creating user', info: err}});
      });

  },

  getUserById: function (userId) {

    return new Promise(function (resolve, reject) {
      return User.findOne({_id: userId}, function (err, user) {

        if (err) {
          log.error('error on getting by id', err);
          return reject({success: false, extras: {message: 'Error on finding user', info: err}});
        }

        if (user) {
          return resolve({success: true, extras: {message: 'User was finded'}});
        } else {
          return reject({success: false, extras: {message: 'User is not exist', info: err}});
        }

      });
    });
  }
};
