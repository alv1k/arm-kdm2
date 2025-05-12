// store.js
import { configureStore } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import navbarReducer from './slices/navbarSlice';
import tabsReducer from './slices/tabsSlice';
import requestsReducer, { fetchRequestsList } from './slices/requestsSlice';
import userReducer from './slices/userSlice';
import modalReducer from './slices/modalSlice';
import authReducer from './slices/authSlice';
import agreementsReducer, { fetchAgreementsList } from './slices/agreementsSlice';
import loadingSlice, { setLoadingStart, setLoadingEnd } from './slices/loadingSlice';
import { fetchProfileData } from './slices/userSlice'; 

// Middleware для логирования действий
const loggingMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action.type);
  return next(action);
};

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: 
    fetchProfileData.pending || 
    fetchAgreementsList.pending ||
    fetchRequestsList.pending ||
    fetchAuth.pending,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(setLoadingStart());
  },
});

listenerMiddleware.startListening({
  actionCreator: 
    fetchProfileData.fulfilled || 
    fetchAgreementsList.fulfilled ||
    fetchRequestsList.fulfilled ||
    fetchAuth.fulfilled,
  effect: (action, listenerApi) => {
    console.log('Профиль загружен:', action.payload);
    listenerApi.dispatch({ type: 'HIDE_LOADER' });
    listenerApi.dispatch(setLoadingEnd());
  },
});

listenerMiddleware.startListening({
  actionCreator: 
    fetchProfileData.rejected || 
    fetchAgreementsList.rejected ||
    fetchRequestsList.rejected ||
    fetchAuth.rejected,
  effect: (action, listenerApi) => {
    console.error('Ошибка:', action.error);
    listenerApi.dispatch({
      type: 'SHOW_ERROR',
      payload: action.error.message,
    });
    listenerApi.dispatch(setLoadingEnd());
  },
});

// Контроль длительных запросов
listenerMiddleware.startListening({
  predicate: (action) => 
    action.type === fetchProfileData.pending.type || 
    action.type === fetchAgreementsList.pending.type,
  effect: async (action, listenerApi) => {
    const timeoutId = setTimeout(() => {
      listenerApi.dispatch({
        type: 'SHOW_TIMEOUT_WARNING',
      });
    }, 10000);

    // Ждем завершения (любого исхода)
    await listenerApi.condition((action) => 
      fetchProfileData.fulfilled.match(action) ||
      fetchProfileData.rejected.match(action)
    );
    listenerApi.dispatch(setLoadingEnd());   
    
    clearTimeout(timeoutId);
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loggingMiddleware)
      .concat(listenerMiddleware.middleware),
});

export default store;