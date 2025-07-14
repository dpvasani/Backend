import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, resetVideos } from '../store/slices/videoSlice';
import VideoCard from '../components/Video/VideoCard';
import { cn } from '../utils/cn';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, hasMore, error } = useSelector((state) => state.video);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');

  useEffect(() => {
    dispatch(resetVideos());
    dispatch(fetchVideos({ 
      page: 1, 
      limit: 12, 
      sortBy, 
      sortType 
    }));
  }, [dispatch, sortBy, sortType]);

  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchVideos({ 
        page: Math.floor(videos.length / 12) + 1, 
        limit: 12, 
        sortBy, 
        sortType 
      }));
    }
  };

  const filters = [
    { label: 'Latest', sortBy: 'createdAt', sortType: 'desc' },
    { label: 'Most Viewed', sortBy: 'views', sortType: 'desc' },
    { label: 'Oldest', sortBy: 'createdAt', sortType: 'asc' },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(resetVideos());
              dispatch(fetchVideos({ page: 1, limit: 12, sortBy, sortType }));
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Discover Videos
        </h1>
        
        {/* Filters */}
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => {
                setSortBy(filter.sortBy);
                setSortType(filter.sortType);
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                sortBy === filter.sortBy && sortType === filter.sortType
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More Videos'
                )}
              </button>
            </div>
          )}
        </>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="flex space-x-3">
                <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No videos found. Be the first to upload!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;