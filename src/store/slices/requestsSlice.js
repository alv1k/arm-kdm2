import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchRequestsList = createAsyncThunk(
  'requestsSlice/fetchRequestsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      
      const response = await api.get(`/apps?token=${token}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchNewRequest = createAsyncThunk(
  'requestsSlice/fetchNewRequest',
  async (_, { rejectWithValue }) => {
    let payload = _;    
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      
      const response = await api.post(`/setApp`, payload);
      if (!response.data.success) {
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    isNewRequest: false,
    requestsList: [],
    loading: false,
    error: null,
    isNewRequestSaved: false,
    page404: false,
  },
  reducers: {
    toggleStatus(state) {      
      state.isNewRequest = !state.isNewRequest
    },
    requestStatusFalse: (state) => {
      state.isNewRequest = false;
    },
  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchRequestsList.fulfilled, (state, action) => {
          state.requestsList = action.payload; // Сохраняем загруженные данные
          state.loading = false;
          state.page404 = false;
        })
        .addCase(fetchRequestsList.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.page404 = false;
        })
        // Обработка ошибки
        .addCase(fetchRequestsList.rejected, (state, action) => {
          state.loading = false;
          state.page404 = true;
          state.error = action.payload || 'Failed to fetch';
          state.requestsList = [];
        })
        .addCase(fetchNewRequest.fulfilled, (state) => {
          state.isNewRequestSaved = true;
          state.loading = false;
          state.page404 = false;
        })
        .addCase(fetchNewRequest.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.page404 = false;
        })
        .addCase(fetchNewRequest.rejected, (state, action) => {
          state.loading = false;
          state.page404 = true;
          state.error = action.payload || 'Failed to fetch';
        });
    }
});


export const isNew = (state) => state.requests_slice.isNewRequest;
export const requestsList = (state) => state.requests_slice.requestsList;
export const { toggleStatus, requestStatusFalse } = requestsSlice.actions;
export default requestsSlice.reducer;