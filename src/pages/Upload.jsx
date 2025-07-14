import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CloudArrowUpIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { uploadVideo } from '../store/slices/videoSlice';
import toast from 'react-hot-toast';

const Upload = () => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.video);

  const {
    register,
    handleSubmit,
    watch,
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Video
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your content with the world
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video File *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {videoPreview ? (
                <div className="space-y-4">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPreview(null);
                      document.querySelector('input[name="videoFile"]').value = '';
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove video
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="videoFile" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Click to upload video
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        MP4, WebM, or OGG (MAX. 100MB)
                      </span>
                    </label>
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
                </div>
              )}
            </div>
            {errors.videoFile && (
              <p className="form-error">{errors.videoFile.message}</p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {thumbnailPreview ? (
                <div className="space-y-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview(null);
                      document.querySelector('input[name="thumbnail"]').value = '';
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove thumbnail
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Click to upload thumbnail
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF (MAX. 5MB)
                      </span>
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
              <p className="form-error">{errors.thumbnail.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              className="form-input mt-1"
              placeholder="Enter video title"
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
              rows={4}
              className="form-input mt-1"
              placeholder="Describe your video"
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
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
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
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