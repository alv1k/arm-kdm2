// src/store/slices/apiSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchUsers = createAsyncThunk(
  'agrees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/agrees');      
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
  
);