import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invalidToken } from '@/store/slices/userSlice.js'
import api from '@/api/api';

export const fetchContactsList = createAsyncThunk(
  'contactsSlice/fetchContactsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      
      const response = await api.get(`/contacts?token=${token}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contactsSlice',
  initialState: {
    contacts: [],
    error: null,    
    page404: false,
  },
  reducers: {
    
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsList.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.page404 = false;       
      })
      .addCase(fetchContactsList.pending, (state) => {
        state.error = null;
        state.page404 = false;
      })
      .addCase(fetchContactsList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch agreements';
        state.page404 = true;
      })      
  }
});


export const {  } = contactsSlice.actions;
export default contactsSlice.reducer;