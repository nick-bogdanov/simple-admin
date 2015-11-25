"use strict";

var mongoose = require('mongoose');
var crypto   = require('crypto');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  email       : {type: String, required: true, unique: true},
  name        : {type: String, require: true},
  passwordHash: String,
  passwordSalt: String
});

UserSchema.methods.createHash = function (pass, salt) {
  salt = salt || Math.random().toString();

  this.passwordSalt = salt;

  return crypto.createHash('sha1', pass).update(salt).digest('hex');

};


module.exports = mongoose.model('User', UserSchema);