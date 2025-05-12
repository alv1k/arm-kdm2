// store.js
import { configureStore } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import navbarReducer from './slices/navbarSlice';
import tabsReducer from './slices/tabsSlice';
import requestsReducer, { fetchRequestsList } from './slices/requestsSlice';
import userReducer from './slices/userSlice';
import modalReducer from './slices/modalSlice';
import authReducer, { fetchAuth } from './slices/authSlice';
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
  predicate: (action) => [
    fetchProfileData.pending,
    fetchAgreementsList.pending,
    fetchRequestsList.pending,
    fetchAuth.pending,
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
    fetchRequestsList.fulfilled,
    fetchAuth.fulfilled
  ].some(creator => creator.match(action)),
  
  effect: (action, listenerApi) => {
    try {
      listenerApi.dispatch({ type: 'HIDE_LOADER' });
      listenerApi.dispatch(setLoadingEnd());
      console.log('Successfully processed:', action.type);
    } catch (error) {
      console.error('Error in fulfilled listener:', error);
    }
  },
});

listenerMiddleware.startListening({
  predicate: (action) => [
    fetchProfileData.rejected,
    fetchAgreementsList.rejected,
    fetchRequestsList.rejected,
    fetchAuth.rejected
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

// Контроль длительных запросов
// listenerMiddleware.startListening({
//   predicate: (action) => [
//     fetchProfileData.pending,
//     fetchAgreementsList.pending,
//     fetchRequestsList.pending,
//     fetchAuth.pending
//   ].some(creator => creator.match(action)),
  
//   effect: async (action, listenerApi) => {
//     const timeoutId = setTimeout(() => {
//       listenerApi.dispatch(showTimeoutWarning());
//     }, 10000);

//     try {
//       const completionActions = [
//         fetchProfileData.fulfilled,
//         fetchProfileData.rejected,
//         fetchAgreementsList.fulfilled,
//         fetchAgreementsList.rejected,
//         fetchRequestsList.fulfilled,
//         fetchRequestsList.rejected,
//         fetchAuth.fulfilled,
//         fetchAuth.rejected
//       ];

//       await listenerApi.condition((action) => 
//         completionActions.some(creator => creator.match(action))
//       );

//     } finally {
//       clearTimeout(timeoutId);
//       // listenerApi.dispatch(setLoadingEnd());
//     }
//   },
// });

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