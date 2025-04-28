import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchAgreementsList = createAsyncThunk(
  'agreementsSlice/fetchAgreementsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      
      const response = await api.get(`/agrees?token=${token}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      console.log(response.data.data, 'data here'); 
      return await response.data.data;
    } catch (error) {      
      return rejectWithValue(error.message);
    }
  }
);


const agreementsSlice = createSlice({
  name: 'agreementsSlice',
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
      {
        num: 'num789',
        "Договор":"Договор аренды №16-116 от 24.05.2024 г. г. Якутск, ул. Каландаришвили, д.7",
        "ОбъектыАренды":[
           {
              "ОбъектАренды":"нежилое помещение этаж чердачный, 40,4 кв.м.",
              "Услуги":[
                 {
                    "Услуга":"Холодное водоснабжение",
                    "НачалоАренды":"4024-06-01",
                    "КонецАренды":"4025-04-30",
                    "Сумма":0.00
                 },
                 {
                    "Услуга":"Горячее водоснабжение",
                    "НачалоАренды":"4024-06-01",
                    "КонецАренды":"4025-04-30",
                    "Сумма":0.00
                 },
                 {
                    "Услуга":"Водоотведение",
                    "НачалоАренды":"4024-06-01",
                    "КонецАренды":"4025-04-30",
                    "Сумма":0.00
                 },
                 {
                    "Услуга":"Аренда нежилых помещений (мес)",
                    "НачалоАренды":"4024-06-01",
                    "КонецАренды":"4025-04-30",
                    "Сумма":66000.00
                 },
                 {
                    "Услуга":"Электроснабжение",
                    "НачалоАренды":"4024-06-01",
                    "КонецАренды":"4025-04-30",
                    "Сумма":0.00
                 }
              ],
              "Сумма":66000.00
           }
        ],
        "Сумма":66000.00
     },
    ],
    selectedAgreement: [],
  },
  reducers: {
    showDetails: (state, action) => {
      state.showDetails = true; 
    },
    hideDetails: (state) => {
      state.showDetails = false;
    },
    setAgreementsList: (state, action) => {
      state.selectedAgreement = [action.payload]  
    },
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgreementsList.fulfilled, (state, action) => {
        state.agreementsList = action.payload; // Сохраняем загруженные данные в agreementsList
      });
  }
});


export const selectedType = (state) => state.agreements_slice.type;
export const isShowDetails = (state) => state.agreements_slice.showDetails;
export const selectedTab = (state) => state.agreements_slice.tab;
export const agreementsStoreList = (state) => state.agreements_slice.agreementsList;
export const selectedAgreement = (state) => state.agreements_slice.selectedAgreement;
export const { showDetails, hideDetails, setAgreementsList } = agreementsSlice.actions;
export default agreementsSlice.reducer;