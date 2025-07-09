import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xl">
        {user.name ? user.name.charAt(0) : 'U'}
      </div>
      <div>
        <Link to={`/profile/${user._id}`} className="font-bold text-gray-900 dark:text-white hover:underline">
          {user.name || 'Unknown User'}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.email.split('@')[0]}</p>
        {user.bio && <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{user.bio}</p>}
      </div>
      {/* Future: Follow/Unfollow button here */}
    </div>
  );
};

export default UserCard; 