import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'status',
  initialState: {
    isPasswordChange: false,
  },
  reducers: {
    togglePasswordChange(state) {      
      state.isPasswordChange = !state.isPasswordChange
    },
    setToken(state, action) {      
      localStorage.setItem('token', action.payload)
    },
    removeToken(state) {      
      localStorage.removeItem('token')
    }
  },
});


export const isPasswordModification = (state) => state.user_slice.isPasswordChange;
export const { togglePasswordChange, setToken, removeToken } = userSlice.actions;
export default userSlice.reducer;