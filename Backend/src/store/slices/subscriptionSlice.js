import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import toast from 'react-hot-toast';

export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/subscriptions/c/${channelId}`);
      const isSubscribed = response.data.data.subscribed;
      toast.success(isSubscribed ? 'Subscribed successfully!' : 'Unsubscribed successfully!');
      return { channelId, isSubscribed };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle subscription');
    }
  }
);

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchSubscriptions',
  async (subscriberId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subscriptions/c/${subscriberId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

const initialState = {
  subscriptions: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { channelId, isSubscribed } = action.payload;
        if (isSubscribed) {
          // Add to subscriptions if not already there
          if (!state.subscriptions.find(sub => sub._id === channelId)) {
            state.subscriptions.push({ _id: channelId });
          }
        } else {
          // Remove from subscriptions
          state.subscriptions = state.subscriptions.filter(sub => sub._id !== channelId);
        }
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;