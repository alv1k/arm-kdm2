import { createSlice } from '@reduxjs/toolkit';

const agreementsSlice = createSlice({
  name: 'agreementTypes',
  initialState: { value: 'all' },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload; // Устанавливаем значение из действия
    },
  }
});
export const selectValue = (state) => state.agreements_types.value;
export const { setValue } = agreementsSlice.actions;
export default agreementsSlice.reducer;