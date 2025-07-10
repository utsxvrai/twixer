import React from 'react';
import UserSearch from './UserSearch';

const RightSidebar = () => {
  return (
    <div className="w-[550px] p-4 hidden lg:block space-y-4 sticky top-0 h-screen overflow-y-auto">
      <div className="relative rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-lg">
        <UserSearch />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-extrabold mb-4 text-gray-900 dark:text-white">Subscribe to Premium</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
          Subscribe to unlock new features and if eligible, receive a share of revenue.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200 animate-pulse-on-hover">
          Subscribe
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-extrabold mb-4 text-gray-900 dark:text-white">What's happening</h3>
        <ul>
          <li className="mb-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">Trending in India</p>
            <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">NFL Top 100 Countdown</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">LIVE</p>
          </li>
          <li className="mb-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">Business & finance · Trending</p>
            <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">#Jio का दुनिया, नेटवर्क</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">8,441 posts</p>
          </li>
          <li className="mb-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">Motorsport · Trending</p>
            <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">Hulkenberg</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">222K posts</p>
          </li>
          <li className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">Trending in India</p>
            <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">STYLE ICON V</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200">499K posts</p>
          </li>
        </ul>
        <button className="text-blue-500 hover:text-blue-600 mt-4 font-semibold text-sm p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 animate-pulse-on-hover">
          Show more
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;