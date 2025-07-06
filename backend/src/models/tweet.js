const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // refers to User model
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
