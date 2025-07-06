const { TweetController } = require('../../controllers');
const { checkAuth } = require('../../middlewares/auth-middleware');
const { validateTweetRequest } = require('../../middlewares/tweet-middleware');
const { Router } = require('express');

const router = Router();

// Create a tweet
router.post(
  '/createtweet',
  checkAuth,
  validateTweetRequest,
  TweetController.createTweet
);

// Get a single tweet by ID
router.get(
  '/:id',
  checkAuth,
  TweetController.getTweet
);

// Get all tweets for the authenticated user
router.get(
  '/',
  checkAuth,
  TweetController.getAllTweets
);

// Update a tweet by ID
router.put(
  '/:id',
  checkAuth,
  validateTweetRequest,
  TweetController.updateTweet
);

// Delete a tweet by ID
router.delete(
  '/:id',
  checkAuth,
  TweetController.deleteTweet
);


// Like a tweet by ID
router.post(
  '/:id/like',
  checkAuth,
  TweetController.likeTweet
);

// Unlike a tweet by ID
router.post(
  '/:id/unlike',
  checkAuth,
  TweetController.unlikeTweet
);

// Add a comment to a tweet
router.post(
  '/:id/comment',
  checkAuth,
  TweetController.addComment
);


module.exports = router;