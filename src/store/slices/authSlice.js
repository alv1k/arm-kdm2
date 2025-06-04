import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchAuth = createAsyncThunk(
  'authSlice/fetchAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      } 
    } catch (error) { 
      console.log(error, 'error auth');
           
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRestorePassword = createAsyncThunk(
  'authSlice/fetchRestorePassword',
  async(_, { rejectWithValue }) => {
    let payload = null;
    _ ? payload = _ : null;
    try {
      let params = {}
      payload ? 
      params = {
        'email': payload.email
      } : ''
      const response = await api.post(`/restore`, params);
      if (!response.data.success) {
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data;
    } catch (error) {
      console.log(error, 'error');
      return rejectWithValue(error.message);
    }
  }
)

const authSlice = createSlice({
  name: 'login',
  initialState: {
    isRestorePassword: false,
    rememberMe: false,
  },
  reducers: {
    toggleRestorePassword(state) {      
      state.isRestorePassword = !state.isRestorePassword
    },
    setRememberMe(state, action) {
      state.rememberMe = action.payload      
    }
  },
});

export const isRestorePass = (state) => state.auth_slice.isRestorePassword;
export const rememberMe = (state) => state.auth_slice.rememberMe;
export const { toggleRestorePassword, setRememberMe } = authSlice.actions;
export default authSlice.reducer;