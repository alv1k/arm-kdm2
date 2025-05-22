import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { showToast } from '@/utils/notify';

export const fetchProfileData = createAsyncThunk(
  'userSlice/fetchProfileData',
  async (_, { rejectWithValue }) => {
    let payload = null;
    _ ? payload = _ : null;
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      let params = {
        'token' : token
      }
      payload ? 
      params = {
        'token' : token,
        'oldPassword': payload.oldPassword,
        'newPassword': payload.newPassword
      } : ''
      const response = await api.post(`/profile`, params);
      if (!response.data.success) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      } 
      if (payload && response.data.message == 'Пароль изменен') {         
        showToast('Пароль изменен', 'success', {
          autoClose: 5000,
        });
      }
      return await response.data.data;
    } catch (error) {
      console.log(error, 'error');
      if (error.message == 'timeout of 5000ms exceeded') {
        console.log('timeout of 5000ms exceeded');        
      }
      return rejectWithValue(error.message);
    }
  }
)

const userSlice = createSlice({
  name: 'status',
  initialState: {
    isPasswordChange: false,
    userData: null,
    error: null,
    profileData: null,
    page404: false,
  },
  reducers: {
    togglePasswordChange(state, action) {      
      state.isPasswordChange = action.payload
    },
    setToken(state, action) {      
      localStorage.setItem('token', action.payload)
      state.error = null;
    },
    removeToken(state) {      
      localStorage.removeItem('token')
      sessionStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=0; path=/;';
      state.error = null;
    },
    setUserData(state, action) {
      state.userData = action.payload
    },    
    invalidToken(state) {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token');
      state.error = 'Неверный токен';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.page404 = false;       
      })
      .addCase(fetchProfileData.pending, (state) => {
        state.error = null;
        state.page404 = false;       
      })
      // Обработка ошибки
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch profileData';
        state.page404 = true;
      });
  }
});


export const isPasswordModification = (state) => state.user_slice.isPasswordChange;
export const userData = (state) => state.user_slice.userData;
export const { togglePasswordChange, setToken, removeToken, setUserData, invalidToken } = userSlice.actions;
export default userSlice.reducer;