import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TweetService from '../api/tweet-service';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const TweetPage = () => {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await TweetService.getTweet(tweetId);
        setTweet(response.data.data);
        setComments(response.data.data.comments || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tweet.');
        setLoading(false);
        toast.error('Failed to load tweet.');
      }
    };
    fetchTweet();
  }, [tweetId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setPosting(true);
    try {
      const res = await TweetService.commentOnTweet(tweetId, commentContent);
      setComments([...comments, res.data.data]);
      setCommentContent('');
    } catch (err) {
      toast.error('Failed to post reply.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }
  if (!tweet) {
    return <div className="flex items-center justify-center h-full">Tweet not found.</div>;
  }

  return (
    <div className="w-full  mx-auto h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 py-3">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeftIcon className="h-6 w-6 text-gray-700 dark:text-white" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Post</h2>
      </div>
      {/* Main Tweet */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">
            {tweet.author?.name ? tweet.author.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">{tweet.author?.name || 'Unknown User'}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">@{tweet.author?.username || 'unknown'}</div>
          </div>
        </div>
        <div className="text-gray-900 dark:text-gray-100 text-lg mb-2">{tweet.content}</div>
        {tweet.image && (
          <div className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            <img src={tweet.image} alt="Tweet content" className="w-full h-auto object-cover" />
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(tweet.createdAt).toLocaleString()}</div>
      </div>
      {/* Replies */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <form onSubmit={handleComment} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Tweet your reply..."
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            disabled={posting}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm disabled:opacity-50"
            disabled={posting || !commentContent.trim()}
          >
            Reply
          </button>
        </form>
        {comments.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center">No replies yet. Be the first to reply!</div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-inner">
              <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white text-base font-bold flex-shrink-0 border border-white">
                {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900 dark:text-white text-base">{comment.user?.name || 'Unknown User'}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">@{comment.user?.username || 'unknown'}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">· {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mt-0.5 text-base">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TweetPage;
