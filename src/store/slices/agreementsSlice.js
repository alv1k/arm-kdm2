import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

export const fetchAgreementsList = createAsyncThunk(
  'agreementsSlice/fetchAgreementsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      
      const response = await api.get(`/agrees?token=${token}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        localStorage.removeItem('token')
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      localStorage.removeItem('token')
      window.location.href = '/login';
      return rejectWithValue(error.message);
    }
  }
);

const agreementsSlice = createSlice({
  name: 'agreementsSlice',
  initialState: { 
    showDetails: false,
    isShowCountersModal: false,
    isShowPaymentModal: false,
    loading: false,
    error: null,
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
    showDetails: (state) => {      
      state.showDetails = true; 
    },
    hideDetails: (state) => {
      state.showDetails = false;
    },
    setAgreementsList: (state, action) => {
      state.selectedAgreement = [action.payload]  
    },
    setShowCountersModal: (state) => {
      state.isShowCountersModal = true
    },
    setHideCountersModal: (state) => {
      state.isShowCountersModal = false
    },
    setShowPaymentModal: (state) => {
      state.isShowPaymentModal = true
    },
    setHidePaymentModal: (state) => {
      state.isShowPaymentModal = false
    }
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgreementsList.fulfilled, (state, action) => {
        state.agreementsList = action.payload; // Сохраняем загруженные данные в agreementsList
        state.loading = false;
      })
      .addCase(fetchAgreementsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обработка ошибки
      .addCase(fetchAgreementsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch agreements';
      });
  }
});


export const selectAgreementsLoading = (state) => state.agreements_slice.loading;
export const selectAgreementsError = (state) => state.agreements_slice.error;

export const selectedType = (state) => state.agreements_slice.type;
export const isShowDetails = (state) => state.agreements_slice.showDetails;
export const selectedTab = (state) => state.agreements_slice.tab;
export const agreementsStoreList = (state) => state.agreements_slice.agreementsList;
export const selectedAgreement = (state) => state.agreements_slice.selectedAgreement;
export const isShowCountersModal = (state) => state.agreements_slice.isShowCountersModal;
export const isShowPaymentModal = (state) => state.agreements_slice.isShowPaymentModal;
export const { showDetails, hideDetails, setAgreementsList, setShowCountersModal, setHideCountersModal, setShowPaymentModal, setHidePaymentModal } = agreementsSlice.actions;
export default agreementsSlice.reducer;