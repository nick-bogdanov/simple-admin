"use strict";
var crypto = require("crypto");

exports.encrypt = function (data, pass) {
  var algorithm = 'aes-256-ctr';
  var cipher    = crypto.createCipher(algorithm, pass);
  var crypted   = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decrypt = function (data, pass) {
  var algorithm = 'aes-256-ctr';
  var decipher  = crypto.createDecipher(algorithm, pass);
  var dec;

  try {
    dec = decipher.update(data, 'hex', 'utf8');
  } catch (e) {
    return e;
  }

  dec += decipher.final('utf8');

  return dec;
};