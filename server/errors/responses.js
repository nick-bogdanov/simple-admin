'use strict';

var log            = require('../lib/logger');
var errorResponses = require('../models/errorResponses');
var _              = require('lodash');

function _response(defaults, assign) {
  /* Error returning model */
  var errModel = {
    success: false,
    message: 'Some error',
    info   : 'debugging info'
  };

  return _.assign({}, errModel, defaults, assign);
}

exports.queryError = function (data) {
  return _response({message: errorResponses.dbQueryError}, data);
};

exports.dataError = function (data) {
  return _response({message: errorResponses.badData}, data || {});
};

exports.userExists = function (data) {
  return _response({message: errorResponses.userExists}, data || {});
};

exports.incorrectPassword = function (data) {
  return _response({message: errorResponses.incorrectPassword}, data || {});
};

exports.userNotExists = function (data) {
  return _response({message: errorResponses.userNotExists}, data || {});
};

