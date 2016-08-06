const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: {
    type: String
  },
  text: {
    type: String
  },
  comments: [{type: mongoose.Schema.ObjectId, ref: 'Comment'}]
})

module.exports = mongoose.model('Post', postSchema);
