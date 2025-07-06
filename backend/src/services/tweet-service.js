const { StatusCodes } = require('http-status-codes');
const  { TweetRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const Comment = require('../models/comment');
const User = require('../models/user')



const tweetRepository = new TweetRepository();

async function create(data){
    try {
        const tweet = await tweetRepository.create(data);
        await User.findByIdAndUpdate(tweet.author, { $inc: { noOfPosts: 1 } });
        return tweet;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getTweet(id) {
    try {
        const tweet = await tweetRepository.get(id);
        return tweet;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getAllTweets(_id){
    try{
        const tweets = await tweetRepository.getTweetsByUser(_id);
        return tweets;
    } catch(error){
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

async function updateTweet(id, data, currentUser) {
    try {
        const tweet = await tweetRepository.get(id);

        // 🔐 Ownership check
        if (tweet.author.toString() !== currentUser) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not allowed to update this tweet');
        }
        const updatedTweet = await tweetRepository.update(id, data);
        return updatedTweet;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteTweet(id, currentUser) {
    try {
        const tweet = await tweetRepository.get(id);
        if(tweet.author.toString()!== currentUser){
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not allowed to delete this tweet');
        }
        const deletedTweet = await tweetRepository.destroy(id);
        return deletedTweet;
    } catch (error) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}


async function likeTweet(tweetId, userId) {
  const tweet = await tweetRepository.get(tweetId);

  if (tweet.likes.includes(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Already liked');
  }

  tweet.likes.push(userId);
  await tweet.save();
  return tweet;
}

async function unlikeTweet(tweetId, userId) {
  const tweet = await tweetRepository.get(tweetId);

  if (!tweet.likes.includes(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Not liked yet');
  }

  tweet.likes = tweet.likes.filter(id => id.toString() !== userId.toString());
  await tweet.save();
  return tweet;
}

async function addComment({ tweetId, userId, text }) {
  try {
    const comment = await Comment.create({
      tweet: tweetId,
      user: userId,
      text
    });

    const tweet = await tweetRepository.get(tweetId);
    tweet.comments.push(comment._id);
    await tweet.save();

    return comment;
  } catch (error) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


module.exports = {
    create,
    getTweet,
    getAllTweets,
    updateTweet,
    deleteTweet,
    likeTweet,
    unlikeTweet,
    addComment
};
