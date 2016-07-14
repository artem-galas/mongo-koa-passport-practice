'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
})

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username}, done);
}))

module.exports = passport.initialize();
