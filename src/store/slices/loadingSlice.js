import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoadingStart(state) {
      state.isLoading = true
    },
    setLoadingEnd(state) {
      state.isLoading = false      
    },
  }
})

export const { setLoadingStart, setLoadingEnd } = loadingSlice.actions
export default loadingSlice.reducer;