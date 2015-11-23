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

UserSchema.methods.createHash = function (pass) {
  var salt = Math.random().toString();

  this.passwordSalt = salt;
  this.passwordHash = crypto.createHash('sha1', pass).update(salt).digest('hex');

};

module.exports = mongoose.model('User', UserSchema);