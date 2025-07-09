import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../api/user-service';
import TweetService from '../api/tweet-service';
import TweetCard from '../components/TweetCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CalendarIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts'); // New state for active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userResponse = await UserService.getUser(userId);
        setProfileUser(userResponse.data.data); 

        const tweetsResponse = await TweetService.getTweetsByUserId(userId);
        setUserTweets(tweetsResponse.data.data);

        if (currentUser && userResponse.data.data.followers.includes(currentUser._id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data.');
        setLoading(false);
        console.error(err);
        toast.error('Failed to load profile.');
      }
    };
    fetchProfileData();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.info('Please log in to follow users.');
      return;
    }
    try {
      if (isFollowing) {
        await UserService.unfollowUser(userId);
        setIsFollowing(false);
        toast.success('Unfollowed!');
      } else {
        await UserService.followUser(userId);
        setIsFollowing(true);
        toast.success('Followed!');
      }
      const userResponse = await UserService.getUser(userId);
      setProfileUser(userResponse.data.data);
    } catch (err) {
      toast.error('Failed to update follow status.');
      console.error('Error following/unfollowing:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
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

  if (!profileUser) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">User not found.</p>
      </div>
    );
  }

  const tabs = ['Posts', 'Replies', 'Highlights', 'Articles', 'Media', 'Likes'];

  return (
    <div className="flex-grow bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-full lg:max-w-[600px] lg:mx-auto">
      {/* Profile Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition-colors duration-200">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{profileUser.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userTweets.length} posts</p>
          </div>
        </div>

        <div className="relative h-48 bg-gray-300 dark:bg-gray-700 overflow-hidden">
          {/* Placeholder for banner image */}
          {profileUser.bannerImage ? (
            <>
              <img src={profileUser.bannerImage} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          )}
          <div className="absolute -bottom-16 left-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-blue-400 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
              {profileUser.profilePicture ? (
                <img src={profileUser.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </div>

        <div className="p-4 pt-20">
          <div className="flex justify-end mb-4">
            {currentUser && currentUser._id === profileUser._id ? (
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200">
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`py-2 px-6 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 ${isFollowing ? 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700' : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">@{profileUser.email.split('@')[0]}</p>
          <p className="text-gray-900 dark:text-gray-100 mb-3">{profileUser.bio || 'No bio available.'}</p>

          <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mb-3 space-x-4">
            {profileUser.location && (
              <span className="flex items-center mb-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {profileUser.location}
              </span>
            )}
            {profileUser.joinedDate && (
              <span className="flex items-center mb-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Joined {new Date(profileUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="flex space-x-4 text-gray-900 dark:text-white text-sm mb-4">
            <div className="flex items-center space-x-1 group">
              <span className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{profileUser.following ? profileUser.following.length : 0}</span>
              <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">Following</span>
            </div>
            <div className="flex items-center space-x-1 group">
              <span className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{profileUser.followers ? profileUser.followers.length : 0}</span>
              <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">Followers</span>
            </div>
          </div>

          {/* "You aren't verified yet" section */}
          {currentUser && currentUser._id === profileUser._id && (
            <div className="bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between text-blue-800 dark:text-blue-200 mb-4 space-y-2 sm:space-y-0">
              <div>
                <p className="font-bold mb-1">You aren't verified yet</p>
                <p className="text-sm">Get verified for boosted replies, analytics, ad-free browsing, and more. Upgrade your profile now.</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full text-sm flex-shrink-0 w-full sm:w-auto">
                Get verified
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Posts, Replies, Media, Likes */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex justify-around overflow-x-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner mx-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-shrink-0 py-2 px-6 rounded-full font-semibold transition-all duration-200 
              ${activeTab === tab 
                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 animate-pulse-on-hover' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-0">
        {activeTab === 'Posts' && userTweets.length > 0 ? (
          userTweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} onDeleteTweet={() => setUserTweets(userTweets.filter(t => t._id !== tweet._id))} onEditTweet={(updatedTweet) => setUserTweets(userTweets.map(t => t._id === updatedTweet._id ? updatedTweet : t))} />
          ))
        ) : activeTab === 'Posts' ? (
          <p className="text-center text-gray-600 dark:text-gray-400 p-4">No posts yet.</p>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 p-4">No {activeTab.toLowerCase()} to display.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 