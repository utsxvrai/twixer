import React, { useState, useEffect } from 'react';
import TweetService from '../api/tweet-service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PencilIcon, TrashIcon, HeartIcon as OutlineHeartIcon, ChatBubbleLeftIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';

const CommentBox = ({ tweetId, onNewComment }) => {
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await TweetService.commentOnTweet(tweetId, commentContent);
      toast.success('Comment posted!');
      setCommentContent('');
      onNewComment(response.data.data); // Assuming backend returns the new comment object
    } catch (error) {
      toast.error('Failed to post comment.');
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
      {currentUser && (
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-md font-bold flex-shrink-0 mr-2 border border-white">
          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
      <input
        type="text"
        className="flex-grow p-2 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm bg-transparent"
        placeholder="Tweet your reply..."
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full text-sm disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg animate-pulse-on-hover"
        disabled={loading || !commentContent.trim()}
      >
        Reply
      </button>
    </form>
  );
};

const TweetCard = ({ tweet, onDeleteTweet, onEditTweet }) => {
  const [likesCount, setLikesCount] = useState(tweet.likes ? tweet.likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(tweet.comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);

  const { user: currentUser } = useAuth(); 
  const isAuthor = currentUser && tweet.author && currentUser._id === tweet.author._id;

  useEffect(() => {
    if (currentUser && tweet.likes && tweet.likes.includes(currentUser._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    setLikesCount(tweet.likes ? tweet.likes.length : 0);
    setComments(tweet.comments || []);
  }, [tweet, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.info('Please log in to like tweets.');
      return;
    }
    try {
      if (isLiked) {
        await TweetService.unlikeTweet(tweet._id);
        setLikesCount(likesCount - 1);
      } else {
        await TweetService.likeTweet(tweet._id);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to update like status.');
      console.error('Error liking tweet:', error);
    }
  };

  const handleNewComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      try {
        await TweetService.deleteTweet(tweet._id);
        toast.success('Tweet deleted successfully!');
        onDeleteTweet(tweet._id); 
      } catch (error) {
        toast.error('Failed to delete tweet.');
        console.error('Error deleting tweet:', error);
      }
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (!editedContent.trim()) {
        toast.error('Tweet content cannot be empty.');
        return;
      }
      try {
        const response = await TweetService.editTweet(tweet._id, editedContent);
        toast.success('Tweet updated successfully!');
        setIsEditing(false);
        onEditTweet(response.data.data); 
      } catch (error) {
        toast.error('Failed to update tweet.');
        console.error('Error updating tweet:', error);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md mb-4 last:mb-0">
      <div className="flex items-start space-x-3">
        <Link to={`/profile/${tweet.author._id}`} className="flex-shrink-0 group">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-bold border-2 border-white transform transition-transform duration-200 group-hover:scale-105">
            {tweet.author.name ? tweet.author.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </Link>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Link to={`/profile/${tweet.author._id}`} className="font-bold text-gray-900 dark:text-white hover:underline text-lg">
                {tweet.author.name || 'Unknown User'}
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">@{tweet.author?.email?.split('@')[0] || 'unknown'}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">· {new Date(tweet.createdAt).toLocaleDateString()}</span>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 animate-pulse-on-hover"
                  title="Edit Tweet"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 animate-pulse-on-hover"
                  title="Delete Tweet"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2 text-base"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            ></textarea>
          ) : (
            <p className="text-gray-900 dark:text-gray-100 mt-1 mb-2 text-base leading-relaxed">{tweet.content}</p>
          )}

          {tweet.image && (
            <div className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
              <img src={tweet.image} alt="Tweet content" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 mt-3 border-t border-gray-100 dark:border-gray-700 pt-2">
            <button onClick={handleLike} className={`flex items-center space-x-1 p-2 rounded-full transition-all duration-200 group 
              ${isLiked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 transform scale-110' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 group-hover:scale-110'}
              `}>
              {isLiked ? <SolidHeartIcon className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-125" /> : <OutlineHeartIcon className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-125" />}
              <span className="text-sm transition-all duration-200 group-hover:font-semibold">{likesCount}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 transition-all duration-200 group">
              <ChatBubbleLeftIcon className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-125" />
              <span className="text-sm transition-all duration-200 group-hover:font-semibold">{comments.length}</span>
            </button>
            <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-500 transition-all duration-200 group">
              <ArrowPathIcon className="h-5 w-5 transform transition-transform duration-200 group-hover:rotate-45 group-hover:scale-125" />
              <span className="text-sm transition-all duration-200 group-hover:font-semibold">0</span>
            </button>
            <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 transition-all duration-200 group">
              <ChartBarIcon className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-125" />
              <span className="text-sm transition-all duration-200 group-hover:font-semibold">0</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-4">
              <CommentBox tweetId={tweet._id} onNewComment={handleNewComment} />
              <div className="mt-4 space-y-3">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment._id} className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-white">
                        {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{comment.author?.name || 'Unknown User'}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">@{comment.author?.email?.split('@')[0] || 'unknown'}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">· {new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mt-0.5 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">No comments yet. Be the first to reply!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard; 