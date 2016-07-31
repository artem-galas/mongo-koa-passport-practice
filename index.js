'use strict';

const koa = require('koa');
const app = koa();
const bodyParser = require('koa-bodyparser')
const mongoose = require('./libs/mongooseConfig');
const Router = require('koa-router');
const User = require('./models/user');
const Post = require('./models/post');
const passport = require('koa-passport');
const views = require('koa-view');
const session = require('koa-generic-session')
const render = require('koa-ejs');
const fs = require('fs');
const path = require('path');

app.keys = ['secret']

const middelwares = fs.readdirSync(path.join(__dirname, 'middelwares')).sort();

middelwares.forEach(function(middelware) {
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
  .get('/', function*(next) {
    yield this.render('home');
  })
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
      successRedirect: '/profile',
      failureRedirect: '/sign_up'
    });
  })
  .get('/profile', function*(next) {
    if (this.isAuthenticated()) {
      yield this.render('profile', {user:this.passport.user});
    } else {
      this.redirect('sign_up');
    }
  })
  .get('/profile/edit', function*(next) {
    if (this.isAuthenticated()){
      yield this.render('profile_edit', {user: this.passport.user});
    } else {
      this.redirect('sign_up');
    }
  })
  .post('/profile/update', function*(next) {
    let user_id = this.request.body.user_id
    let user = yield User.findById(user_id);
    yield user.update({username: this.request.body.username, email: this.request.body.email});
    this.redirect('/profile');
  })
  .get('/users/posts', function*(next){
    yield this.render('posts/index');
  })
  .get('/users/posts/new', function*(next){
    yield this.render('posts/new');
  })
  .post('/users/posts/create', function*(next) {
    console.log(this.session.passport.user);
    let user_id = this.session.passport.user
    let user = yield User.findById(user_id);
    yield user.posts.create({
      title: this.request.body.title,
      text: this.request.body.text
    })
    console.log(this.request.body);
  })
  .get('/logout', function*(next) {
    this.logout()
    this.redirect('/sign_in')
  })

app.use(router.routes());
app.listen(3000)
