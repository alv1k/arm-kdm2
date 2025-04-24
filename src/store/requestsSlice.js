import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    isNewRequest: false,
  },
  reducers: {
    toggleStatus(state) {      
      state.isNewRequest = !state.isNewRequest
    },
  },
});


export const isNew = (state) => state.requests_slice.isNewRequest;
export const { toggleStatus } = requestsSlice.actions;
export default requestsSlice.reducer;