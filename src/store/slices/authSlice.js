import { createSlice } from '@reduxjs/toolkit';

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