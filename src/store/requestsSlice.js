import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    isNewRequest: false,
  },
  reducers: {
    toggleTabs(state, action) {      
      
    },
  },
});

export const isNew = (state) => state.requests_slice.isNewRequest;
export const { toggleTabs } = requestsSlice.actions;
export default requestsSlice.reducer;