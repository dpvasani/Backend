import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  DotsHorizontalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import { fetchTweets, createTweet, deleteTweet } from '../store/slices/tweetSlice';
import { cn } from '../utils/cn';

const Tweets = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const dispatch = useDispatch();
  const { tweets, loading } = useSelector((state) => state.tweet);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchTweets(user._id));
    }
  }, [dispatch, isAuthenticated, user]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (tweetContent.trim() && isAuthenticated) {
      await dispatch(createTweet(tweetContent.trim()));
      setTweetContent('');
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    await dispatch(deleteTweet(tweetId));
    setShowDropdown(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleOvalLeftIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sign in to tweet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Join the conversation and share your thoughts with the community.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <ChatBubbleOvalLeftIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tweets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts with the community
          </p>
        </div>
      </div>

      {/* Create Tweet */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleCreateTweet}>
          <div className="flex space-x-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100'}
              alt={user?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-lg"
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-4">
                <span className={cn(
                  "text-sm",
                  tweetContent.length > 260 ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                )}>
                  {tweetContent.length}/280
                </span>
                <button
                  type="submit"
                  disabled={!tweetContent.trim() || loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-full font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Tweet'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Tweets List */}
      <div className="space-y-4">
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex space-x-4">
                <img
                  src={tweet.ownerDetails?.avatar?.url || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={tweet.ownerDetails?.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {tweet.ownerDetails?.username || user?.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        @{tweet.ownerDetails?.username || user?.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {/* Tweet Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === tweet._id ? null : tweet._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <DotsHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                      
                      {showDropdown === tweet._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                          <button
                            onClick={() => handleDeleteTweet(tweet._id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span>Delete Tweet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white text-lg leading-relaxed mb-4">
                    {tweet.content}
                  </p>
                  
                  {/* Tweet Actions */}
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                      <span className="text-sm">0</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      {tweet.isLiked ? (
                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span className="text-sm">{tweet.likesCount || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleOvalLeftIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tweets yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Share your first thought with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;