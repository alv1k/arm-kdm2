import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
      return rejectWithValue(error.message);
    }
  }
);

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