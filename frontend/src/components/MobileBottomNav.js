import React from 'react';
import { HomeIcon, BellIcon, ChatBubbleLeftIcon, BookmarkIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Explore', icon: MagnifyingGlassIcon, path: '/explore' },
    { name: 'Notifications', icon: BellIcon, path: '/notifications' },
    { name: 'Messages', icon: ChatBubbleLeftIcon, path: '/messages' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 md:hidden z-50">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200 ${location.pathname === item.path ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
      <Link
        to={`/profile/${user?._id}`}
        className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200 ${location.pathname.startsWith('/profile') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}
      >
        <UserIcon className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav; 