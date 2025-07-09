import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TweetService from '../api/tweet-service';
import TweetCard from '../components/TweetCard';
import TweetInputBox from '../components/TweetInputBox';
import RightSidebar from '../components/RightSidebar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-grow border-x border-gray-200 dark:border-gray-700 max-w-[600px] mx-auto bg-white dark:bg-gray-900">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Home</h2>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <TweetInputBox onNewTweet={handleNewTweet} />
          </div>
        )}

        <div className="mt-0">
          {tweets.length > 0 ? (
            tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} onDeleteTweet={handleDeleteTweet} onEditTweet={handleEditTweet} />)
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 p-4">No tweets yet. Be the first to post!</p>
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default HomePage; 