import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState: { 
    showModal: false,
    dataType: null,
    dataOfModal: null,
  },
  reducers: {
    setDataType: (state, action) => {
      state.dataType = action.payload
    },
    setShowModal: (state) => {
      state.showModal = !state.showModal
    },
    setDataOfModal: (state, action) => {
      state.dataOfModal = action.payload
    }
  },
});

export const dataType = (state) => state.modal_slice.dataType;
export const showModal = (state) => state.modal_slice.showModal;
export const dataOfModal = (state) => state.modal_slice.dataOfModal;
export const { setDataType, setShowModal, setDataOfModal } = modalSlice.actions;
export default modalSlice.reducer;