import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchAgreementsList = createAsyncThunk(
//   'agreementTypes/fetchAgreementsList',
//   async () => {
//     const response = await fetch('localhost:3000/'); // Замените на ваш URL
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json(); // Предполагаем, что API возвращает JSON
//   }
// );

const agreementsSlice = createSlice({
  name: 'agreementTypes',
  initialState: { 
    showDetails: false,
    type: { title_en: 'all', title_ru: 'Все' },
    tab: { title_en: 'bills', title_ru: 'Счета' },
    agreementsList: [
      {
        name: 'agree1',
        summ: 400000,
        date: new Date(2025, 5, 6).toLocaleDateString(), // Преобразуем дату в строку
        address: 'г. Якутск, ул. Ленина 123, 1 этаж, каб. №123',
        num: 'num123'
      },
      {
        name: 'agree2',
        summ: 250000,
        date: new Date(2025, 7, 15).toLocaleDateString(),
        address: 'г. Москва, ул. Пушкина 10',
        num: 'num456'
      },
    ],
    selectedAgreement: [],
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    showDetails: (state, action) => {
      state.showDetails = true;         
    },
    hideDetails: (state) => {
      state.showDetails = false;
    },
    setTab: (state, action) => {
      state.tab = action.payload
    },
    setAgreementsList: (state, action) => {
      state.selectedAgreement = [action.payload]
      console.log(state.selectedAgreement);      
    },
  },  
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchAgreementsList.fulfilled, (state, action) => {
  //       state.agreementsList = action.payload; // Сохраняем загруженные данные в agreementsList
  //     });
  // }
});
export const selectedType = (state) => state.agreements_slice.type;
export const isShowDetails = (state) => state.agreements_slice.showDetails;
export const selectedTab = (state) => state.agreements_slice.tab;
export const agreementsStoreList = (state) => state.agreements_slice.agreementsList;
export const selectedAgreement = (state) => state.agreements_slice.selectedAgreement;
export const { setType, showDetails, hideDetails, setTab, setAgreementsList } = agreementsSlice.actions;
export default agreementsSlice.reducer;