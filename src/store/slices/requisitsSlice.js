import { createSlice } from "@reduxjs/toolkit";

const requisitsSlice = createSlice({
  name: 'requisits',
  initialState: {
    showRequisits: false,
  },
  reducers: {
    setShowRequisits(state, action) {
      state.showRequisits = action.payload      
    },
  }
})

export const { setShowRequisits } = requisitsSlice.actions
export default requisitsSlice.reducer;