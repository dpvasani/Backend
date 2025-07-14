import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { registerUser, clearError } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchAvatar = watch('avatar');
  const watchCoverImage = watch('coverImage');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (watchAvatar && watchAvatar[0]) {
      const file = watchAvatar[0];
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchAvatar]);

  useEffect(() => {
    if (watchCoverImage && watchCoverImage[0]) {
      const file = watchCoverImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [watchCoverImage]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
        avatar: data.avatar[0],
        coverImage: data.coverImage[0],
      };

      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        navigate('/login');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">YT</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters',
                  },
                })}
                type="text"
                className="form-input mt-1"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="form-error">{errors.fullName.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                })}
                type="text"
                className="form-input mt-1"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="form-error">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="form-input mt-1"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <input
                  {...register('avatar', {
                    required: 'Profile picture is required',
                  })}
                  type="file"
                  accept="image/*"
                  className="form-input flex-1"
                />
              </div>
              {errors.avatar && (
                <p className="form-error">{errors.avatar.message}</p>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image (Optional)
              </label>
              <div className="mt-1">
                {coverImagePreview && (
                  <div className="mb-2 w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  {...register('coverImage')}
                  type="file"
                  accept="image/*"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;