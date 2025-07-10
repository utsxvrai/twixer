import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TweetService from '../api/tweet-service';
import TweetCard from '../components/TweetCard';
import TweetInputBox from '../components/TweetInputBox';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await TweetService.fetchTweets();
        setTweets(response.data.data); // Assuming data is in response.data.data
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tweets.');
        setLoading(false);
        console.error(err);
      }
    };
    getTweets();
  }, []);

  const handleNewTweet = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets(tweets.filter(tweet => tweet._id !== tweetId));
  };

  const handleEditTweet = (updatedTweet) => {
    setTweets(tweets.map(tweet => tweet._id === updatedTweet._id ? updatedTweet : tweet));
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading tweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-10xl mt-2 space-y-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 px-6 py-4 sticky top-0 z-10">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Home</h2>
      </div>
      {user && (
        <TweetInputBox onNewTweet={handleNewTweet} />
      )}
      <div>
        {tweets.length > 0 ? (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} onDeleteTweet={handleDeleteTweet} onEditTweet={handleEditTweet} />)
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 p-4">No tweets yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;