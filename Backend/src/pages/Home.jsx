import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, resetVideos } from '../store/slices/videoSlice';
import VideoCard from '../components/Video/VideoCard';
import { cn } from '../utils/cn';
import { 
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, hasMore, error } = useSelector((state) => state.video);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');
  const [layout, setLayout] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Music', 'Gaming', 'Sports', 'News', 'Movies', 'Live', 'Fashion', 
    'Learning', 'Comedy', 'Technology', 'Cooking', 'Travel', 'Fitness'
  ];

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
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(resetVideos());
              dispatch(fetchVideos({ page: 1, limit: 12, sortBy, sortType }));
            }}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === category
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Home
          </h1>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Layout Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setLayout('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                layout === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                layout === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Sort Filters */}
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <select
              value={`${sortBy}-${sortType}`}
              onChange={(e) => {
                const [newSortBy, newSortType] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortType(newSortType);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="createdAt-desc">Latest</option>
              <option value="views-desc">Most Viewed</option>
              <option value="createdAt-asc">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {videos.length > 0 ? (
        <>
          {layout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} layout="list" />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {Array.from({ length: layout === 'grid' ? 8 : 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              {layout === 'grid' ? (
                <>
                  <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl mb-3" />
                  <div className="flex space-x-3">
                    <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex space-x-4 p-4">
                  <div className="w-48 h-28 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Be the first to upload and share your content!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;