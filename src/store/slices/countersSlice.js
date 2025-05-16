import { createSlice } from "@reduxjs/toolkit";

const countersSlice = createSlice({
  name: 'counters',
  initialState: {
    fetchedIndices: false,
    error: null,
  },
  reducers: {
    setFetchedIndices(state, action) {
      state.fetchedIndices = action.payload;
    },
    setFetchIndicesError(state, action) {
      state.error = action.payload;
    }
  }
})
export const { setFetchedIndices, setFetchIndicesError } = countersSlice.actions;
export default countersSlice.reducer;