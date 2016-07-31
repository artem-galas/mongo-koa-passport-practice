const mongoose = require('mongoose');
const Post = require('./post');
const userSchema = new mongoose.Schema({
  email:{
    type: String,
    require: true,
    unique: true
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true
  },
  posts: [{type: mongoose.Schema.ObjectId, ref: 'Post'}],
});

module.exports = mongoose.model('User', userSchema);
