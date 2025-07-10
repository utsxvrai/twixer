const { StatusCodes } = require('http-status-codes');
const { TweetService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const { add } = require('winston');

async function createTweet(req, res) {
    try {
        const tweet = await TweetService.create({
            author: req.user.id, 
            content: req.body.content,
            image: req.body.image || null 
        });

        SuccessResponse.data = tweet;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function getTweet(req, res) {
    try {
        const tweet = await TweetService.getTweet(req.params.id);
        SuccessResponse.data = tweet;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function getAllTweets(req, res) {
    try {
        const tweets = await TweetService.getAllTweets(req.user.id);
        SuccessResponse.data = tweets;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getTweetsByUser(req, res) {
    try {
        const tweets = await TweetService.getTweetsByUserId(req.params.userId);
        SuccessResponse.data = tweets;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateTweet(req, res) {
    try {
        const updatedTweet = await TweetService.updateTweet(req.params.id, req.body, req.user.id);
        SuccessResponse.data = updatedTweet;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}   

async function deleteTweet(req,res){
    try{
        const deleteTweet = await TweetService.deleteTweet(req.params.id, req.user.id);
        SuccessResponse.data = deleteTweet;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch(error){
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function likeTweet(req, res) {
  try {
    const tweet = await TweetService.likeTweet(req.params.id, req.user.id);
    // Save notification in DB for tweet author (if not liking own tweet)
    if (tweet.author._id.toString() !== req.user.id) {
      const User = require('../models/user');
      await User.findByIdAndUpdate(
        tweet.author._id,
        {
          $push: {
            notifications: {
              type: 'like',
              fromUser: req.user.id,
              tweet: tweet._id,
              message: `${req.user.name} (@${req.user.username}) liked your post!`,
              createdAt: new Date()
            }
          }
        }
      );
    }
    SuccessResponse.data = tweet;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function addComment(req, res) {
  try {
    const comment = await TweetService.addComment({
      tweetId: req.params.id,
      userId: req.user.id,
      text: req.body.text
    });
    // Save notification in DB for tweet author (if not commenting on own tweet)
    const Tweet = require('../models/tweet');
    const tweet = await Tweet.findById(req.params.id).populate('author');
    if (tweet.author._id.toString() !== req.user.id) {
      const User = require('../models/user');
      await User.findByIdAndUpdate(
        tweet.author._id,
        {
          $push: {
            notifications: {
              type: 'comment',
              fromUser: req.user.id,
              tweet: tweet._id,
              message: `${req.user.name} (@${req.user.username}) commented on your post!`,
              createdAt: new Date()
            }
          }
        }
      );
    }
    SuccessResponse.data = comment;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function unlikeTweet(req, res) {
  try {
    const tweet = await TweetService.unlikeTweet(req.params.id, req.user.id);
    SuccessResponse.data = tweet;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}



module.exports = {
    createTweet,
    getTweet,
    getAllTweets,
    getTweetsByUser,
    updateTweet,
    deleteTweet,
    likeTweet,
    addComment,
    unlikeTweet

}