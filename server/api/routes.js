'use strict';

var log = require('../lib/logger');

module.exports = function (app) {

  var api = require('./controllers/users');

  app.get('/', function (req, res) {
    res.render('index');
    log.info(req.session.token);
  });

  app.get('/views/:name', function (req, res) {
    res.render(req.params.name);
  });

  app.get('/views/:path/:name', function (req, res) {
    res.render(req.params.path + "/" + req.params.name);
  });


  app.post('/api/register', function (req, res) {

    api.user.register(req.body).then(function (data) {

      if (data) {
        req.session.token = data._id;
        return res.json({success: true, extras: {message: 'Регистрация прошла успешно.'}});
      }

      throw new Error('Cant register');

    }).catch(function (err) {
      log.error(err);
      res.json({success: false, extras: {message: 'User exist. Try again', info: err}});
    });

  });

  app.post('api/login', function (req, res) {
    //res.redirect('/');
  });
};
