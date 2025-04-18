import { createSlice } from '@reduxjs/toolkit';

const agreementsList = [
  { title_ru: 'Все', title_en: 'all' },
  { title_ru: 'Действующие', title_en: 'active' },
  { title_ru: 'Неактуальные', title_en: 'inactive' }
];
const singleAgreementsList = [
  { title_ru: 'Счета', title_en: 'bills' },
  { title_ru: 'Акты', title_en: 'acts' },
  { title_ru: 'Показания', title_en: 'counters' }
]

const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabs: [1,2,3]
  },
  reducers: {
    toggleTabs(state, action) {
      if (action.payload.target == 'agreements') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.tabs = agreementsList.slice(1);
            break;
          default:
            state.tabs = [...agreementsList]; 
            break;
        }        
      } else if (action.payload.target == 'singleAgreement') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.tabs = singleAgreementsList;
            break;
          default:
            state.tabs = [...singleAgreementsList]; 
            break;
        }
      } else {
        console.log('no target');        
      }
    },
  },
});

export const { tabs, toggleTabs } = tabSlice.actions;
export default tabSlice.reducer;