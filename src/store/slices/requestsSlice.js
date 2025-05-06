import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchRequestsList = createAsyncThunk(
  'requestsSlice/fetchRequestsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
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
        localStorage.removeItem('token')
        // window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      localStorage.removeItem('token')
      // window.location.href = '/login';
      return rejectWithValue(error.message);
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    isNewRequest: false,
  },
  reducers: {
    toggleStatus(state) {      
      state.isNewRequest = !state.isNewRequest
    },
    requestStatusFalse: (state) => {
      state.isNewRequest = false;
    },
  },
});


export const isNew = (state) => state.requests_slice.isNewRequest;
export const { toggleStatus, requestStatusFalse } = requestsSlice.actions;
export default requestsSlice.reducer;