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
    tabs: [
      { title_ru: 'Все', title_en: 'all' },
      { title_ru: 'Действующие', title_en: 'active' },
      { title_ru: 'Неактуальные', title_en: 'inactive' }
    ],
    selectedTab: null,
  },
  reducers: {
    toggleTabs(state, action) {
      if (action.payload.type == 'agreementsList') {
        console.log(action, 'toggleTabs');
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.tabs = agreementsList.slice(1);            
            break;
          default:
            state.tabs = [...agreementsList]; 
            break;
        }        
      } else if (action.payload.type == 'singleAgreement') {
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
    setSelectedTab(state, action) {      
      state.selectedTab = {
        title_en: action.payload.title_en,
        title_ru: action.payload.title_ru,
      }
    },
    setTabs(state, action) {
      if (action.payload == 'agreementsList') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.tabs = agreementsList.slice(1);
            break;
          default:
            state.tabs = [...agreementsList]; 
            break;
        }        
      } else if (action.payload == 'singleAgreement') {
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
    }
  },
});

export const selectedTab = (state) => state.tabs_slice.selectedTab;
export const { tabs, toggleTabs, setSelectedTab, setTabs } = tabSlice.actions;
export default tabSlice.reducer;