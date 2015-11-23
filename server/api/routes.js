'use strict';
var passport = require('passport');
var User     = require('../models/user');
var express  = require('express');
var router   = express.Router();
var log = require('../lib/logger');

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/views/:name', function (req, res) {
  res.render(req.params.name);
});

router.get('/views/:path/:name', function (req, res) {
  res.render(req.params.path + "/" + req.params.name);
});

router.post('/api/register', function (req, res) {
  User.register(new User({
    username: req.body.userName,
    email: req.body.userEmail
  }), req.body.userPass, function (err, account) {

    if (err) {
      log.error(err);
      return res.json({
        success: false,
        extras : {
          message: 'Пользователь с таким логином или имейлом уже существует.',
          info: err.message
        }
      });
    }

    if (account) {
      log.info('registered');

      res.json({
        success: true,
        extras : {
          message: 'Пользователь успешно зарегестрирован.',
          info: account._id
        }
      });

    }
  });

});

router.post('api/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/');
});


module.exports = router;
