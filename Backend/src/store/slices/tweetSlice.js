import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import toast from 'react-hot-toast';

export const fetchTweets = createAsyncThunk(
  'tweet/fetchTweets',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tweets/user/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tweets');
    }
  }
);

export const createTweet = createAsyncThunk(
  'tweet/createTweet',
  async (content, { rejectWithValue }) => {
    try {
      const response = await api.post('/tweets', { content });
      toast.success('Tweet posted successfully!');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tweet');
    }
  }
);

export const deleteTweet = createAsyncThunk(
  'tweet/deleteTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await api.delete(`/tweets/${tweetId}`);
      toast.success('Tweet deleted successfully!');
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tweet');
    }
  }
);

const initialState = {
  tweets: [],
  loading: false,
  error: null,
};

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.tweets.unshift(action.payload);
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
      });
  },
});

export const { clearError } = tweetSlice.actions;
export default tweetSlice.reducer;