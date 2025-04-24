// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from '../store/navbarSlice'; // Импортируем редюсер
import agreementsReducer from './agreementsSlice';
import tabsReducer from './tabsSlice';
import requestsReducer from './requestsSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
    agreements_slice: agreementsReducer,
    tabs_slice: tabsReducer,
    requests_slice: requestsReducer,
    user_slice: userSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      console.log('Dispatching:', action.type);
      return next(action);
    }),
});

export default store;