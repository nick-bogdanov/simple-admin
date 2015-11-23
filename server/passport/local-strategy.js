"use strict";


var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var log = require('../lib/logger');

module.exports = function(passport) {

  passport.use(new LocalStrategy(
    function(email, password, done) {
      log.info(email);
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.checkPass(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });



};

