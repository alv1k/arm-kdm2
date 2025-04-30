import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState: { 
    showModal: false,
    dataType: null,
  },
  reducers: {
    setDataType: (state, action) => {
      state.dataType = action.payload
    },
    setShowModal: (state) => {
      state.showModal = !state.showModal
    },
  },
});

export const dataType = (state) => state.modal_slice.dataType;
export const showModal = (state) => state.modal_slice.showModal;
export const { setDataType, setShowModal } = modalSlice.actions;
export default modalSlice.reducer;