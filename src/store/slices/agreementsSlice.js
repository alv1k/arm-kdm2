import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invalidToken } from '@/store/slices/userSlice.js'
import api from '@/api/api';

export const fetchAgreementsList = createAsyncThunk(
  'agreementsSlice/fetchAgreementsList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
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
        sessionStorage.removeItem('token');
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/login';
        throw new Error(`HTTP error! status: ${response.data.status}`);
      }
      return await response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDowloadFile = createAsyncThunk(
  'agreementsSlice/fetchDowloadFile',
  async (_, { rejectWithValue }) => {
    const id = _;    
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }

      const response = await api.get(`/files?token=${token}&id=${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.data.success) {
        if (response.data.message == 'Неверный токен') { 
          console.log('hmmmmm');
                
          dispatch(invalidToken());
          return rejectWithValue('Неверный токен');
        }
        // throw new Error(`HTTP error! status: ${response.data.message}`);
        return rejectWithValue(response.data.message);
      }
      return await response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)
const getObjects = (agreeList) => {  
  const allObjects = agreeList.flatMap(agree => agree.objects || []);  
  
    if (!Array.isArray(allObjects)) return [];
    
    const idMap = new Map();
    
    allObjects.forEach(object => {
      if (object?.id && !idMap.has(object.id)) {
        idMap.set(object.id, object);
      }
    });
    
    return Array.from(idMap.values());
  return allObjects;
}
const getInvoices = (agreeList) => {
  const allInvoices = agreeList.invoices.map(invoice => invoice || []);  
  return allInvoices;
}

export const fetchSendCountersIndice = createAsyncThunk(
  'agreementsSlice/fetchSendCountersIndice',
  async (item, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token not found');
      }
      let indice_num = Number(item.value);
      
      if (indice_num != 0 && indice_num != '') {        
        const response = await api.get(`/setindice?token=${token}&counter=${item.id}&indice=${item.value}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.data.success) {
          throw new Error(`HTTP error! status: ${response.data.status}`);
        }
        return await response.data;
      }
    } catch (error) {      
      console.log(error);      
      return rejectWithValue(error.message);
    }
  }
)

const agreementsSlice = createSlice({
  name: 'agreementsSlice',
  initialState: { 
    showDetails: false,
    isShowCountersModal: false,
    isShowPaymentModal: false,
    error: null,
    type: { title_en: 'all', title_ru: 'Все' },
    tab: { title_en: 'bills', title_ru: 'Счета' },
    agreementsList: [
      {
        name: '',
        summ: 400000,
        date: new Date(2025, 5, 6).toLocaleDateString(), // Преобразуем дату в строку
        address: 'г. Якутск, ул. Ленина 123, 1 этаж, каб. №123',
        num: 'num123'
      },
      {
        name: '',
        summ: 250000,
        date: new Date(2025, 7, 15).toLocaleDateString(),
        address: 'г. Москва, ул. Пушкина 10',
        num: 'num456'
      },
    ],
    selectedAgreement: [],
    fileToDownload: null,
    allObjects: null,
    allInvoices: null,
    page404: false,
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
      state.allInvoices = getInvoices(action.payload) 
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
        state.allObjects = getObjects(action.payload)
        state.page404 = false;       
      })
      .addCase(fetchAgreementsList.pending, (state) => {
        state.error = null;
        state.page404 = false;
      })
      .addCase(fetchAgreementsList.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch agreements';
        state.page404 = true;
      })
      .addCase(fetchDowloadFile.fulfilled, (state, action) => {
        if (action.payload.data != []) {
          state.fileToDownload = [action.payload];
        } else {
          state.fileToDownload = [{
            message: 'no data',
            success: false
          }]
        }
      })
      .addCase(fetchDowloadFile.pending, (state) => {
        state.error = null;
      })
      // Обработка ошибки
      .addCase(fetchDowloadFile.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch file';
      })
      
  }
});

export const selectAgreementsError = (state) => state.agreements_slice.error;

export const isShowDetails = (state) => state.agreements_slice.showDetails;
export const selectedTab = (state) => state.agreements_slice.tab;
export const agreementsStoreList = (state) => state.agreements_slice.agreementsList;
export const selectedAgreement = (state) => state.agreements_slice.selectedAgreement;
export const isShowCountersModal = (state) => state.agreements_slice.isShowCountersModal;
export const isShowPaymentModal = (state) => state.agreements_slice.isShowPaymentModal;
export const { showDetails, hideDetails, setAgreementsList, setShowCountersModal, setHideCountersModal, setShowPaymentModal, setHidePaymentModal } = agreementsSlice.actions;
export default agreementsSlice.reducer;