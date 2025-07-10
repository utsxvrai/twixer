import React, { useState } from 'react';
import UserService from '../api/user-service';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      setLoading(true);
      try {
        const res = await UserService.searchUsers(value);
        setResults(res.data.data);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
        className="w-full py-2.5 px-4 pl-10 rounded-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      {loading && <div className="absolute right-4 top-3 text-xs text-gray-400">Loading...</div>}
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
          {results.map(user => (
            <li
              key={user._id}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <img src={user.profilePicture || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
