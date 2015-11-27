"use strict";

var mongoose = require('mongoose');
var crypto   = require('crypto');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  email       : {type: String, required: true, unique: true},
  name        : {type: String, require: true},
  passwordHash: String,
  passwordSalt: String,
  services    : [{
    login  : String,
    idp    : String,
    balance: {type: Number, default: 0},
    email  : {type: String, default: 'support@mail.com'},
    options: {
      dlr           : {type: String, default: 'get'},
      bank          : {type: String, default: 'cbrf'},
      dir           : {type: String, default: 'smpp'},
      minBalance    : {type: Number, default: 100},
      partnerLimit  : {type: Number, default: 100},
      currentBalance: Number,
      curseType     : {type: String, default: 'everyday'},
      url           : String,
      data          : String
    }
  }]
});

UserSchema.methods.createHash = function (pass, salt) {
  salt = salt || Math.random().toString();

  this.passwordSalt = salt;

  return crypto.createHash('sha1', pass).update(salt).digest('hex');

};


module.exports = mongoose.model('User', UserSchema);