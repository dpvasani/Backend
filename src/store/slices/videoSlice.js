import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import toast from 'react-hot-toast';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'video/fetchVideos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/videos', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(videoData).forEach(key => {
        if (videoData[key]) {
          formData.append(key, videoData[key]);
        }
      });

      const response = await api.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Video uploaded successfully!');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  'video/toggleVideoLike',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/likes/toggle/v/${videoId}`);
      return { videoId, isLiked: response.data.data.isLiked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await api.delete(`/videos/${videoId}`);
      toast.success('Video deleted successfully!');
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video');
    }
  }
);

const initialState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    resetVideos: (state) => {
      state.videos = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        const newVideos = action.payload.docs || [];
        state.videos = state.page === 1 ? newVideos : [...state.videos, ...newVideos];
        state.hasMore = action.payload.hasNextPage || false;
        state.page = action.payload.nextPage || state.page;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch video by ID
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload video
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle like
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        const { videoId, isLiked } = action.payload;
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.isLiked = isLiked;
          state.currentVideo.likesCount += isLiked ? 1 : -1;
        }
        const video = state.videos.find(v => v._id === videoId);
        if (video) {
          video.isLiked = isLiked;
          video.likesCount = (video.likesCount || 0) + (isLiked ? 1 : -1);
        }
      })
      // Delete video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(video => video._id !== action.payload);
        if (state.currentVideo && state.currentVideo._id === action.payload) {
          state.currentVideo = null;
        }
      });
  },
});

export const { clearError, clearCurrentVideo, resetVideos } = videoSlice.actions;
export default videoSlice.reducer;