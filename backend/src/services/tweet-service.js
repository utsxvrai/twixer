const { StatusCodes } = require('http-status-codes');
const  { TweetRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const Comment = require('../models/comment');
const User = require('../models/user')
const { publisher } = require('../config/redis-config');



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
        // Populate author and comments (with user info)
        const tweet = await tweetRepository.model.findById(id)
            .populate('author', 'username name profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username name profilePicture' }
            });
        if (!tweet) throw new AppError(StatusCodes.NOT_FOUND, 'Tweet not found');
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

async function getTweetsByUserId(userId) {
  try {
    const tweets = await tweetRepository.getTweetsByUser(userId);
    return tweets;
  } catch (error) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
    throw new AppError('Already liked', StatusCodes.BAD_REQUEST);
  }
  tweet.likes.push(userId);
  await tweet.save();

  // Notify tweet author if not liking own tweet
  if (tweet.author.toString() !== userId.toString()) {
    const liker = await User.findById(userId);
    await publisher.publish('notifications', JSON.stringify({
      type: 'like',
      targetUserId: tweet.author.toString(),
      payload: {
        tweetId: tweet._id,
        likerId: liker._id,
        likerName: liker.name,
        likerUsername: liker.username
      }
    }));
  }
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

    // Notify tweet author if not commenting on own tweet
    if (tweet.author.toString() !== userId.toString()) {
      const commenter = await User.findById(userId);
      await publisher.publish('notifications', JSON.stringify({
        type: 'comment',
        targetUserId: tweet.author.toString(),
        payload: {
          tweetId: tweet._id,
          commentId: comment._id,
          commenterId: commenter._id,
          commenterName: commenter.name,
          commenterUsername: commenter.username,
          text
        }
      }));
    }
    return comment;
  } catch (error) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


module.exports = {
    create,
    getTweet,
    getAllTweets,
    getTweetsByUserId,
    updateTweet,
    deleteTweet,
    likeTweet,
    unlikeTweet,
    addComment
};
