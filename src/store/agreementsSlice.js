import { createSlice } from '@reduxjs/toolkit';

const agreementsSlice = createSlice({
  name: 'agreementTypes',
  initialState: { 
    type: 'all',
    showDetails: false,
    tab: 'bills',
    selectedAgreement: null,
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    showDetails: (state, action) => {
      state.showDetails = true;
      state.selectedAgreement = action.payload;
      console.log(action, 'actionsss here');
      
    },
    hideDetails: (state) => {
      state.showDetails = false;
    },
    setTab: (state, action) => {
      state.tab = action.payload
    },
  }
});
export const selectedType = (state) => state.agreements_slice.type;
export const isShowDetails = (state) => state.agreements_slice.showDetails;
export const selectedTab = (state) => state.agreements_slice.tab;
export const selectedAgreement = (state) => state.agreements_slice.selectedAgreement;
export const { setType, showDetails, hideDetails, setTab } = agreementsSlice.actions;
export default agreementsSlice.reducer;