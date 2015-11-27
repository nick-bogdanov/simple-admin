'use strict';
var log     = require('../../lib/logger');
var Promise = require('bluebird');
var User    = require('../../models/user');
var ErrResponse = require('../../errors/responses');

exports.user = {
  register: function (data) {

    return new Promise(function (resolve, reject) {

      return User.findOne({'email': data.useremail}, function (err, user) {

        if (err) {
          log.error(err);
          return reject(ErrResponse.queryError({info:err}));
        }

        if (!user) {
          return resolve(data);
        } else {
          return reject(ErrResponse.userExists());
        }

      });

    })
      .then(function (userData) {

        var newUser = User({
          name : userData.username,
          email: userData.useremail
        });

        newUser.passwordHash = newUser.createHash(userData.pass);

        return newUser.save(function (err, user, numAffected) {
          if (err) {
            log.error(err);
            return Promise.reject(ErrResponse.queryError({info: err}));
          }
          if (numAffected === 1) {
            log.info('registered');
            return Promise.resolve({success: true, extras: {message: 'created successful'}});
          }
        });
      })
      .catch(function (err) {
        log.error(err);
        return err;
      });

  },

  findUserById: function (userId) {

    return new Promise(function (resolve, reject) {
      return User.findOne({_id: userId}, function (err, user) {
        //log.debug(user);
        if (err) {
          log.error('error on getting by id', err);
          return reject(ErrResponse.queryError({info: err}));
        }

        if (user) {
          return resolve({success: true, extras: {message: 'User was finded'}});
        } else {
          return reject(ErrResponse.dataError({info: err}));
        }

      });

    });
  },

  login: function (_user) {

    return new Promise(function (resolve, reject) {
      return User.findOne({email: _user.email}, function (err, user) {
        if (err) {
          log.error(err);
          return reject(err);
        }

        if (user) {
          return resolve(user);
        } else {
          return ErrResponse.dataError();
        }

      });

    })
      .then(function (data) {
        var user = new User();
        var hash = user.createHash(_user.pass, data.passwordSalt);

        if (data.passwordHash === hash) {
          return {success: true, extras: {message: 'user find', id: data.id}};
        } else {
          return ErrResponse.incorrectPassword();
        }

      })
      .catch(function (err) {
        log.error(err);
        return err;
      });

  }

};
