import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    showRequisits: false,
  },
  reducers: {
    setLoadingStart(state) {
      state.isLoading = true
    },
    setLoadingEnd(state) {
      state.isLoading = false      
    },
    setShowRequisits(state) {
      state.showRequisits = true      
    },
  }
})

export const { setLoadingStart, setLoadingEnd, setShowRequisits } = loadingSlice.actions
export default loadingSlice.reducer;