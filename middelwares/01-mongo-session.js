const mongoose = require('mongoose');
const session = require('koa-generic-session');
const mongooseStore = require('koa-session-mongoose');

module.exports = session({
  store: mongooseStore.create({
    model:   'Session'
  }),
  cookie: {
    signed: false
  }
});
