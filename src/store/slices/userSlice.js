import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'status',
  initialState: {
    isPasswordChange: false,
    userData: null,
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
    },
    setUserData(state, action) {
      state.userData = action.payload
    }
  },
});


export const isPasswordModification = (state) => state.user_slice.isPasswordChange;
export const userData = (state) => state.user_slice.userData;
export const { togglePasswordChange, setToken, removeToken, setUserData } = userSlice.actions;
export default userSlice.reducer;