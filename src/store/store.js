// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from './slices/navbarSlice'; // Импортируем редюсер
import agreementsReducer from './slices/agreementsSlice';
import tabsReducer from './slices/tabsSlice';
import requestsReducer from './slices/requestsSlice';
import userSlice from './slices/userSlice';

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