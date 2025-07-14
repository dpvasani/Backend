import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { EyeIcon, HeartIcon, DotsVerticalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVideoLike } from '../../store/slices/videoSlice';

const VideoCard = ({ video, showChannel = true, layout = 'grid' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      dispatch(toggleVideoLike(video._id));
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
  };

  if (layout === 'list') {
    return (
      <div className="flex space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <Link to={`/watch/${video._id}`} className="flex-shrink-0">
          <div className="relative w-48 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={video.thumbnail?.url || video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              {video.title}
            </h3>
          </Link>

          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            {video.createdAt && (
              <span>
                {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>

          {showChannel && video.ownerDetails && (
            <Link 
              to={`/channel/${video.ownerDetails.username}`}
              className="flex items-center space-x-2 mt-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <img
                src={video.ownerDetails.avatar?.url || video.ownerDetails.avatar}
                alt={video.ownerDetails.username}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {video.ownerDetails.username}
              </span>
            </Link>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
            {video.description}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <DotsVerticalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      <Link to={`/watch/${video._id}`}>
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
          <img
            src={video.thumbnail?.url || video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
              {formatDuration(video.duration)}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
      </Link>

      <div className="mt-3">
        <div className="flex space-x-3">
          {/* Channel Avatar */}
          {showChannel && video.ownerDetails && (
            <Link 
              to={`/channel/${video.ownerDetails.username}`}
              className="flex-shrink-0"
            >
              <img
                src={video.ownerDetails.avatar?.url || video.ownerDetails.avatar}
                alt={video.ownerDetails.username}
                className="w-9 h-9 rounded-full object-cover"
              />
            </Link>
          )}

          <div className="flex-1 min-w-0">
            {/* Video Title */}
            <Link to={`/watch/${video._id}`}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 leading-5">
                {video.title}
              </h3>
            </Link>

            {/* Channel Name */}
            {showChannel && video.ownerDetails && (
              <Link 
                to={`/channel/${video.ownerDetails.username}`}
                className="block mt-1"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  {video.ownerDetails.username}
                </p>
              </Link>
            )}

            {/* Video Stats */}
            <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
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

          {/* Action Menu */}
          <div className="flex-shrink-0">
            <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200">
              <DotsVerticalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {video.isLiked ? (
              <HeartIconSolid className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
            <span className="text-xs font-medium">
              {video.likesCount || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;