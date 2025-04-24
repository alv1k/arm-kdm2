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
  },
});


export const isPasswordModification = (state) => state.user_slice.isPasswordChange;
export const { togglePasswordChange } = userSlice.actions;
export default userSlice.reducer;