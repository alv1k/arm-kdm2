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
    }
  },
});


export const isPasswordModification = (state) => state.user_slice.isPasswordChange;
export const { togglePasswordChange, setToken } = userSlice.actions;
export default userSlice.reducer;