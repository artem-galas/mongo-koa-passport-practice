'use strict';

const koa = require('koa');
const app = koa();
const bodyParser = require('koa-bodyparser')
const mongoose = require('./libs/mongooseConfig');
const Router = require('koa-router');
const User = require('./models/user');
const passport = require('koa-passport');
const views = require('koa-view');
const session = require('koa-generic-session')
const render = require('koa-ejs');
const fs = require('fs');
const path = require('path');

app.keys = ['secret']

const middelwares = fs.readdirSync(path.join(__dirname, 'middelwares')).sort();
console.log (middelwares);
middelwares.forEach(function(middelware) {
  console.log(middelware);
  app.use(require('./middelwares/' + middelware));
});

app.use(views(__dirname + '/views', { 
  map: {html: 'ejs' }
 }));  

render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html',
  cache: false,
  debug: true
});

const router = new Router();

router
  .get('/sign_up', function*(next) {
    yield this.render('sign_up');
  })
  .post('/sign_up', function*(next){
    let user = yield User.create({
      email: this.request.body.email,
      username: this.request.body.username,
      password: this.request.body.password
    });
    this.body = user.toObject();
  })
  .get('/sign_in', function*(next){
    yield this.render('sign_in');
  })
  .post('/sign_in', function*(next) {
    yield passport.authenticate('local', {
      successRedirect: '/user_view',
      failureRedirect: '/sign_up'
    });
  })
  .get('/user_view', function*(next) {
    if (this.isAuthenticated()) {
      console.log (this.session);
      yield this.render('user_view', {user:this.passport.user});
    } else {
      this.redirect('sign_up');
    }
  })
  .get('/logout', function*(next) {
    this.logout()
    this.redirect('/sign_in')
  })

app.use(router.routes());
app.listen(3000)
