import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  EyeIcon,
  BellIcon,
  DotsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
  HandThumbUpIcon as HandThumbUpIconSolid,
  BellIcon as BellIconSolid,
} from '@heroicons/react/24/solid';
import { fetchVideoById, toggleVideoLike } from '../store/slices/videoSlice';
import { toggleSubscription } from '../store/slices/subscriptionSlice';
import VideoPlayer from '../components/Video/VideoPlayer';
import VideoCard from '../components/Video/VideoCard';

const VideoWatch = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading, videos } = useSelector((state) => state.video);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId));
    }
  }, [dispatch, videoId]);

  const handleLike = () => {
    if (isAuthenticated && currentVideo) {
      dispatch(toggleVideoLike(currentVideo._id));
    }
  };

  const handleSubscribe = () => {
    if (isAuthenticated && currentVideo?.owner) {
      dispatch(toggleSubscription(currentVideo.owner._id));
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl mb-6" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Video not found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            The video you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const relatedVideos = videos.filter(v => v._id !== currentVideo._id).slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="xl:col-span-2">
          {/* Video Player */}
          <div className="mb-6">
            <VideoPlayer
              src={currentVideo.videoFile?.url || currentVideo.videoFile}
              poster={currentVideo.thumbnail?.url || currentVideo.thumbnail}
              className="w-full aspect-video rounded-xl overflow-hidden"
            />
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {currentVideo.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{formatViews(currentVideo.views)} views</span>
                </div>
                {currentVideo.createdAt && (
                  <span>
                    {formatDistanceToNow(new Date(currentVideo.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <button
                    onClick={handleLike}
                    disabled={!isAuthenticated}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-full transition-colors duration-200 disabled:opacity-50"
                  >
                    {currentVideo.isLiked ? (
                      <HandThumbUpIconSolid className="h-5 w-5 text-red-600" />
                    ) : (
                      <HandThumbUpIcon className="h-5 w-5" />
                    )}
                    <span className="font-medium">{currentVideo.likesCount || 0}</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-full transition-colors duration-200">
                    <HandThumbDownIcon className="h-5 w-5" />
                  </button>
                </div>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                  <ShareIcon className="h-5 w-5" />
                  <span className="font-medium">Share</span>
                </button>

                <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                  <DotsHorizontalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Channel Info */}
            {currentVideo.owner && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-4">
                  <Link to={`/channel/${currentVideo.owner.username}`}>
                    <img
                      src={currentVideo.owner.avatar?.url || currentVideo.owner.avatar}
                      alt={currentVideo.owner.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/channel/${currentVideo.owner.username}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {currentVideo.owner.username}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentVideo.owner.subscribersCount || 0} subscribers
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                      {currentVideo.owner.isSubscribed ? (
                        <BellIconSolid className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={handleSubscribe}
                      className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                        currentVideo.owner.isSubscribed
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {currentVideo.owner.isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="text-gray-700 dark:text-gray-300">
                {showFullDescription ? (
                  <p className="whitespace-pre-wrap">{currentVideo.description}</p>
                ) : (
                  <p className="line-clamp-3">{currentVideo.description}</p>
                )}
                {currentVideo.description && currentVideo.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-2 text-sm font-medium transition-colors"
                  >
                    <span>{showFullDescription ? 'Show less' : 'Show more'}</span>
                    {showFullDescription ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comments
                </h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {showComments ? 'Hide' : 'Show'}
                </button>
              </div>

              {showComments && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  {isAuthenticated && (
                    <div className="flex space-x-3">
                      <img
                        src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Your avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            Cancel
                          </button>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sample Comments */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((comment) => (
                      <div key={comment} className="flex space-x-3">
                        <img
                          src={`https://images.pexels.com/photos/${771742 + comment}/pexels-photo-${771742 + comment}.jpeg?auto=compress&cs=tinysrgb&w=100`}
                          alt="Commenter"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              @user{comment}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              2 hours ago
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            This is a sample comment. Great video! Really enjoyed watching this content.
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                              <HandThumbUpIcon className="h-4 w-4" />
                              <span>12</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                              <HandThumbDownIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Up next
          </h3>
          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <div key={video._id} className="flex space-x-3 group">
                <Link to={`/watch/${video._id}`} className="flex-shrink-0">
                  <div className="relative w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={video.thumbnail?.url || video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/watch/${video._id}`}>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-5">
                      {video.title}
                    </h4>
                  </Link>
                  {video.ownerDetails && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {video.ownerDetails.username}
                    </p>
                  )}
                  <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatViews(video.views)} views</span>
                    {video.createdAt && (
                      <>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;