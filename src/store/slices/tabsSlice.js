import { createSlice } from '@reduxjs/toolkit';

const agreementsList = [
  { title_ru: 'Все', title_en: 'all' },
  { title_ru: 'Действующие', title_en: 'active' },
  { title_ru: 'Неактуальные', title_en: 'inactive' }
];
const singleAgreementsList = [
  { title_ru: 'Счета', title_en: 'bills' },
  { title_ru: 'Закрывающие документы', title_en: 'closing_docs' },
  { title_ru: 'Показания', title_en: 'counters' },
  { title_ru: 'Объекты', title_en: 'objects' },
]
const requestsList = [
  { title_ru: 'Мои заявки', title_en: 'my_requests' },
  { title_ru: 'Все', title_en: 'all_requests' },
  { title_ru: 'В работе', title_en: 'in_progress' },
  { title_ru: 'Завершенные', title_en: 'completed' },
  // { title_ru: 'Новая заявка', title_en: 'new_request' },
]
const loginList = [
  // { title_ru: 'Телефон', title_en: 'phone' },
  { title_ru: 'Почта', title_en: 'email' },
];

const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabs: agreementsList,
    agreementsTabs: agreementsList,
    agreementTabs: singleAgreementsList,
    requestsTabs: requestsList,
    loginTabs: loginList,
    selectedTab: null,
    agreementsSelectedTab: null,
    agreementSelectedTab: null,
    requestsSelectedTab: null,
    loginSelectedTab: null,
    testing: ''
  },
  reducers: {
    toggleTabs(state, action) {       
      if (action.payload.type == 'agreementsList') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.agreementsTabs = agreementsList.slice(1);            
            break;
          default:
            state.agreementsTabs = [...agreementsList]; 
            break;
        }        
      } else if (action.payload.type == 'singleAgreement') {               
        switch (action.payload.hasCounters) {
          case true:
            state.agreementTabs = singleAgreementsList;
            break;
          default:
            state.agreementTabs = [
              singleAgreementsList[0],
              singleAgreementsList[1],
              singleAgreementsList[3]
            ].filter(Boolean);
            break;
        }
      } else if (action.payload.type == 'requests') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.requestsTabs = [requestsList[0]];
            break;
          default:
            state.requestsTabs = requestsList.slice(1);
            break;
        }
      } else if (action.payload.type == 'login') {
        switch (action.payload.breakpoint) {
          case 'sm-breakpoint':
            state.loginTabs = loginList;
            break;
          default:
            state.loginTabs = loginList;
            break;
        }
      }
    },
    setAgreementsSelectedTab(state, action) {
      state.selectedTab = {
        title_en: action.payload.title_en,
        title_ru: action.payload.title_ru,
      }
    },
    setAgreementSelectedTab(state, action) {      
      state.selectedTab = {
        title_en: action.payload.title_en,
        title_ru: action.payload.title_ru,
      }
    },
    setRequestsSelectedTab(state, action) {      
      state.selectedTab = {
        title_en: action.payload.title_en,
        title_ru: action.payload.title_ru,
      }      
    },
    setLoginSelectedTab(state, action) {
      state.selectedTab = {
        title_en: action.payload.title_en,
        title_ru: action.payload.title_ru,
      }
    },
  },
});

export const selectedTab = (state) => state.tabs_slice.selectedTab;
export const agreementsTabs = (state) => state.tabs_slice.agreementsTabs;
export const agreementTabs = (state) => state.tabs_slice.agreementTabs;
export const requestsTabs = (state) => state.tabs_slice.requestsTabs;
export const loginTabs = (state) => state.tabs_slice.loginTabs;
export const agreementsSelectedTab = (state) => state.tabs_slice.agreementsSelectedTab;
export const agreementSelectedTab = (state) => state.tabs_slice.agreementSelectedTab;
export const requestsSelectedTab = (state) => state.tabs_slice.requestsSelectedTab;
export const loginSelectedTab = (state) => state.tabs_slice.loginSelectedTab;
export const { tabs, toggleTabs, setAgreementsSelectedTab, setAgreementSelectedTab, setRequestsSelectedTab, setLoginSelectedTab } = tabSlice.actions;
export default tabSlice.reducer;