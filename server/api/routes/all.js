module.exports = function (app) {
  "use strict";

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/views/:name', function (req, res) {
    res.render(req.params.name);
  });

  app.get('/views/:path/:name', function (req, res) {
    res.render(req.params.path + "/" + req.params.name);
  });

};
