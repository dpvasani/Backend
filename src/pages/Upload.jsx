import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  XMarkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { uploadVideo } from '../store/slices/videoSlice';
import toast from 'react-hot-toast';

const Upload = () => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.video);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchVideoFile = watch('videoFile');
  const watchThumbnail = watch('thumbnail');

  React.useEffect(() => {
    if (watchVideoFile && watchVideoFile[0]) {
      const file = watchVideoFile[0];
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchVideoFile]);

  React.useEffect(() => {
    if (watchThumbnail && watchThumbnail[0]) {
      const file = watchThumbnail[0];
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchThumbnail]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setValue('videoFile', e.dataTransfer.files);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        title: data.title,
        description: data.description,
        videoFile: data.videoFile[0],
        thumbnail: data.thumbnail[0],
      };

      const result = await dispatch(uploadVideo(formData));
      if (uploadVideo.fulfilled.match(result)) {
        navigate('/your-videos');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <CloudArrowUpIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Video
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share your content with the world
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Video File *
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
                dragActive
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {videoPreview ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <PlayIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Video uploaded successfully
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {watchVideoFile?.[0]?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setValue('videoFile', null);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <VideoCameraIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <label htmlFor="videoFile" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        Drag and drop video files to upload
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Your videos will be private until you publish them.
                      </p>
                    </label>
                    <div className="mt-4">
                      <label
                        htmlFor="videoFile"
                        className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                      >
                        SELECT FILES
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      MP4, WebM, or MOV (MAX. 100MB)
                    </p>
                  </div>
                  <input
                    {...register('videoFile', {
                      required: 'Video file is required',
                    })}
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    className="sr-only"
                  />
                </div>
              )}
            </div>
            {errors.videoFile && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.videoFile.message}</p>
            )}
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Title must be less than 100 characters',
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Add a title that describes your video"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters',
                    },
                  })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell viewers about your video"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailPreview(null);
                            setValue('thumbnail', null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Thumbnail uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <div>
                        <label htmlFor="thumbnail" className="cursor-pointer">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Upload thumbnail
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PNG, JPG, GIF (MAX. 5MB)
                          </p>
                        </label>
                        <input
                          {...register('thumbnail', {
                            required: 'Thumbnail is required',
                          })}
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.thumbnail.message}</p>
                )}
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visibility
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors">
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CloudArrowUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Uploading video...
                  </p>
                  <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {uploadProgress}% complete
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;