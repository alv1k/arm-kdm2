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
      console.log(action.payload);
      
      if (action.payload.target == 'agreements') {
        state.tabs = agreementsList
      } else if (action.payload.target == 'singleAgreement') {
        state.tabs = singleAgreementsList
      } else {
        console.log('no target');
        
      }
    },
  },
});

// Экспортируем действия и редюсер
export const { tabs, toggleTabs } = tabSlice.actions;
export default tabSlice.reducer;