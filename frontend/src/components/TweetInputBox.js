import React, { useState, useRef } from 'react';
import TweetService from '../api/tweet-service';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user info
import { PhotoIcon, GifIcon, ChartBarIcon, FaceSmileIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TweetInputBox = ({ onNewTweet }) => {
  const [tweetContent, setTweetContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Get logged-in user
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // New state for emoji picker

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) {
      toast.error('Tweet content cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      // For now, we are not handling image upload. This will be a placeholder.
      const response = await TweetService.createTweet(tweetContent, null); 
      toast.success('Tweet posted successfully!');
      setTweetContent('');
      removeImage(); // Use the new removeImage function
      onNewTweet(response.data.data); // Assuming backend returns the new tweet object
    } catch (error) {
      toast.error('Failed to post tweet. Please try again.');
      console.error('Error posting tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex items-start space-x-3">
        {user && (
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 border-2 border-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex-grow relative">
          <div className="relative">
            <textarea
              className={`w-full p-3 text-lg text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none resize-none peer ${tweetContent ? 'pt-6' : ''}`}
              rows="3"
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              disabled={loading}
            ></textarea>
            <label 
              htmlFor="tweet-content" 
              className={`absolute left-3 transition-all duration-200 ease-in-out 
                ${tweetContent 
                  ? 'top-2 text-sm text-gray-500 dark:text-gray-400' 
                  : 'top-1/2 -translate-y-1/2 text-lg text-gray-500 dark:text-gray-400'
                } peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500`}
            >
              What's happening?
            </label>
          </div>
          
          {imagePreview && (
            <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                ref={fileInputRef} 
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <PhotoIcon className="h-full w-full" />
              </label>
              <GifIcon className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" />
              <ChartBarIcon className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" />
              <FaceSmileIcon 
                className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <CalendarIcon className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full text-md shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-on-hover"
              disabled={loading || !tweetContent.trim()}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="loading-shimmer mr-2"></span>
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
              <p className="text-gray-700 dark:text-gray-300 text-sm">Emoji picker (Coming Soon!)</p>
              {/* Placeholder for actual emoji picker component */}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TweetInputBox; 