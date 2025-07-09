import axiosInstance from './axios';

const TWEET_API_URL = '/tweet';

const createTweet = (content, image) => {
  return axiosInstance.post(`${TWEET_API_URL}/createtweet`, { content, image });
};

const fetchTweets = () => {
  return axiosInstance.get(TWEET_API_URL + '/');
};

const getTweetsByUserId = (userId) => {
  return axiosInstance.get(`${TWEET_API_URL}/user/${userId}`);
};

const getTweet = (tweetId) => {
  return axiosInstance.get(`${TWEET_API_URL}/${tweetId}`);
};

const likeTweet = (tweetId) => {
  return axiosInstance.post(`${TWEET_API_URL}/${tweetId}/like`);
};

const unlikeTweet = (tweetId) => {
  return axiosInstance.post(`${TWEET_API_URL}/${tweetId}/unlike`);
};

const commentOnTweet = (tweetId, text) => {
  return axiosInstance.post(`${TWEET_API_URL}/${tweetId}/comment`, { text });
};

const editTweet = (tweetId, content) => {
  return axiosInstance.put(`${TWEET_API_URL}/${tweetId}`, { content });
};

const deleteTweet = (tweetId) => {
  return axiosInstance.delete(`${TWEET_API_URL}/${tweetId}`);
};

const TweetService = {
  createTweet,
  fetchTweets,
  getTweetsByUserId,
  getTweet,
  likeTweet,
  unlikeTweet,
  commentOnTweet,
  editTweet,
  deleteTweet,
};

export default TweetService;