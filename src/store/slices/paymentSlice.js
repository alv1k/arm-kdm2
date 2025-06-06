import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { showToast } from '@/utils/notify';

export const fetchPayment = createAsyncThunk(
  'paymentSlice/fetchPayment',
  async (options, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }      
      const response = await api.post(`/create-payment`, options);
      if (!response.data.success) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data;
    } catch (error) {
      console.log(error, 'error');
      if (error.message == 'timeout of 5000ms exceeded') {
        console.log('timeout of 5000ms exceeded');        
      }
      return rejectWithValue(error.message);
    }
  }
)

export const fetchCheckPayment = createAsyncThunk(
  'paymentSlice/fetchCheckPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      
      const response = await api.get(`/check-payment?paymentId=${paymentId}`);
      if (!response.data.success) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      } 
      localStorage.removeItem('lastPaymentId');
      return await response.data.data.payload;
    } catch (error) {
      console.log(error, 'error');
      if (error.message == 'timeout of 5000ms exceeded') {
        console.log('timeout of 5000ms exceeded');        
      }
      return rejectWithValue(error.message);
    }
  }
)

const paymentSlice = createSlice({
  name: 'paymentSlice',
  initialState: {    
    error: null,
    page404: false,
  },
  reducers: {    
    setUserData(state, action) {
      state.userData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.page404 = false;
      })
      .addCase(fetchPayment.pending, (state) => {
        state.error = null;
        state.page404 = false;
      })
      // Обработка ошибки
      .addCase(fetchPayment.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch payment';
        state.page404 = true;
      });
  }
});

export const { invalidToken } = paymentSlice.actions;
export default paymentSlice.reducer;