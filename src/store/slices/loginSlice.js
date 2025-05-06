import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isRestorePassword: false,
  },
  reducers: {
    toggleRestorePassword(state) {      
      state.isRestorePassword = !state.isRestorePassword
    },
  },
});

export const isRestorePass = (state) => state.login_slice.isRestorePassword;
export const { toggleRestorePassword } = loginSlice.actions;
export default loginSlice.reducer;