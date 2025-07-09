import React from 'react';
import { HomeIcon, BellIcon, ChatBubbleLeftIcon, BookmarkIcon, UserIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon, PencilIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const navItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Explore', icon: MagnifyingGlassIcon, path: '/explore' },
    { name: 'Notifications', icon: BellIcon, path: '/notifications' },
    { name: 'Messages', icon: ChatBubbleLeftIcon, path: '/messages' },
    { name: 'Bookmarks', icon: BookmarkIcon, path: '/bookmarks' },
    { name: 'Profile', icon: UserIcon, path: `/profile/${user?._id}` },
    { name: 'More', icon: EllipsisHorizontalIcon, path: '/more' },
  ];

  return (
    <div className="md:w-20 lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 sticky top-0 h-screen hidden md:flex flex-col items-center lg:items-start z-20">
      <div className="text-blue-500 text-4xl font-extrabold mb-10 pl-2 hidden lg:block">Twixer</div>
      <div className="text-blue-500 text-3xl font-extrabold mb-10 block lg:hidden">T</div>
      <nav className="flex-grow w-full">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2 w-full">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-full transition-all duration-300 ease-in-out group 
                  ${location.pathname === item.path || (item.name === 'Profile' && location.pathname.startsWith('/profile')) 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } justify-center lg:justify-start`}
              >
                <item.icon className="h-8 w-8 lg:mr-4 transform transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden lg:inline text-xl font-semibold transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg mt-6 shadow-lg hover:shadow-xl transition-all duration-300 hidden lg:block w-full animate-pulse-on-hover">
        Post
      </button>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-3 rounded-full mt-6 shadow-lg hover:shadow-xl transition-all duration-300 block lg:hidden flex justify-center items-center animate-pulse-on-hover">
        <PencilIcon className="h-7 w-7" />
      </button>

      {user && (
        <div className="mt-10 flex items-center p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 w-full justify-center lg:justify-start group">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-bold border-2 border-white flex-shrink-0 transform transition-transform duration-200 group-hover:scale-105">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden lg:block ml-3">
            <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{user.name}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">@{user.email.split('@')[0]}</p>
          </div>
        </div>
      )}
      <button 
        onClick={toggleDarkMode} 
        className="mt-4 p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center lg:justify-start w-full group">
        {darkMode ? (
          <SunIcon className="h-6 w-6 lg:mr-4 transform transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <MoonIcon className="h-6 w-6 lg:mr-4 transform transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="hidden lg:inline text-lg font-semibold transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  );
};

export default Sidebar; 