import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  HandThumbUpIcon as HandThumbUpIconSolid,
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
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-6" />
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
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Video not found</p>
        </div>
      </div>
    );
  }

  const relatedVideos = videos.filter(v => v._id !== currentVideo._id).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="mb-6">
            <VideoPlayer
              src={currentVideo.videoFile?.url || currentVideo.videoFile}
              poster={currentVideo.thumbnail?.url || currentVideo.thumbnail}
              className="w-full aspect-video"
            />
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentVideo.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {currentVideo.isLiked ? (
                    <HandThumbUpIconSolid className="h-5 w-5 text-primary-600" />
                  ) : (
                    <HandThumbUpIcon className="h-5 w-5" />
                  )}
                  <span>{currentVideo.likesCount || 0}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
            {currentVideo.owner && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {currentVideo.owner.username}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentVideo.owner.subscribersCount || 0} subscribers
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={handleSubscribe}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      currentVideo.owner.isSubscribed
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {currentVideo.owner.isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-gray-700 dark:text-gray-300">
                {showFullDescription ? (
                  <p className="whitespace-pre-wrap">{currentVideo.description}</p>
                ) : (
                  <p className="line-clamp-3">{currentVideo.description}</p>
                )}
                {currentVideo.description && currentVideo.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-600 dark:text-primary-400 hover:underline mt-2 text-sm font-medium"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Related Videos
          </h3>
          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <div key={video._id} className="flex space-x-3">
                <Link to={`/watch/${video._id}`} className="flex-shrink-0">
                  <img
                    src={video.thumbnail?.url || video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/watch/${video._id}`}>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400">
                      {video.title}
                    </h4>
                  </Link>
                  {video.ownerDetails && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {video.ownerDetails.username}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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