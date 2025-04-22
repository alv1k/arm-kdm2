import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'tabs',
  initialState: {
    isNewRequest: false,
  },
  reducers: {
    toggleTabs(state, action) {      
      
    },
    setSelectedTab(state, action) {          
    },
  },
});

export const isNewRequest = (state) => state.requests_slice.isNewRequest;
export const { toggleTabs } = requestsSlice.actions;
export default requestsSlice.reducer;