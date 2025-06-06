// store.js
import { configureStore } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import navbarReducer from './slices/navbarSlice';
import tabsReducer from './slices/tabsSlice';
import requestsReducer, { fetchRequestsList } from './slices/requestsSlice';
import userReducer from './slices/userSlice';
import modalReducer from './slices/modalSlice';
import authReducer, { fetchAuth } from './slices/authSlice';
import agreementsReducer, { fetchAgreementsList, fetchAgreementsAccruals, fetchSendCountersIndice } from './slices/agreementsSlice';
import loadingSlice, { setLoadingStart, setLoadingEnd } from './slices/loadingSlice';
import countersSlice from './slices/countersSlice';
import paymentSlice from './slices/paymentSlice';
import { fetchProfileData, invalidToken } from './slices/userSlice'; 
import { showToast } from '@/utils/notify';

//Middleware для обработки API ошибок
const tokenErrorMiddleware = store => next => action => {
  if (action?.type?.endsWith('rejected') && action.payload?.message === 'Неверный токен') {
    store.dispatch(invalidToken());
    showToast('Неверный токен! Пожалуйста, войдите снова', 'error', { autoClose: 5000 });
  }
  return next(action);
};

// Middleware для логирования действий
const loggingMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action.type);  
  return next(action);
};

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action) => [
    fetchProfileData.pending,
    fetchAgreementsList.pending,
    fetchAgreementsAccruals.pending,
    fetchRequestsList.pending,
    fetchAuth.pending,
    fetchSendCountersIndice.pending
  ].some(creator => creator.match(action)),
  effect: (action, listenerApi) => {
    try {
      listenerApi.dispatch(setLoadingStart());
    } catch (error) {
      console.error('Error in listener:', error);
    }
  },
});

listenerMiddleware.startListening({
  predicate: (action) => [
    fetchProfileData.fulfilled,
    fetchAgreementsList.fulfilled,
    fetchAgreementsAccruals.fulfilled,
    fetchRequestsList.fulfilled,
    fetchAuth.fulfilled,
    fetchSendCountersIndice.fulfilled
  ].some(creator => creator.match(action)),
  
  effect: (action, listenerApi) => {
    try {
      listenerApi.dispatch(setLoadingEnd());
    } catch (error) {
      console.error('Error in fulfilled listener:', error);
    }
  },
});

listenerMiddleware.startListening({
  predicate: (action) => [
    fetchProfileData.rejected,
    fetchAgreementsList.rejected,
    fetchAgreementsAccruals.rejected,
    fetchRequestsList.rejected,
    fetchAuth.rejected,
    fetchSendCountersIndice.rejected
  ].some(creator => creator.match(action)),
  
  effect: (action, listenerApi) => {    
    try {
      console.error('Request failed:', action.error);
      listenerApi.dispatch({
        type: 'SHOW_ERROR',
        payload: action.error.message,
      });
      listenerApi.dispatch(setLoadingEnd());
    } catch (error) {
      console.error('Error in rejected listener:', error);
    }
  },
});

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
    agreements_slice: agreementsReducer,
    tabs_slice: tabsReducer,
    requests_slice: requestsReducer,
    user_slice: userReducer,
    modal_slice: modalReducer,
    auth_slice: authReducer,
    loading_slice: loadingSlice,
    counters_slice: countersSlice,
    payment_slice: paymentSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loggingMiddleware)
      .concat(listenerMiddleware.middleware)
      .concat(tokenErrorMiddleware),
});

export default store;