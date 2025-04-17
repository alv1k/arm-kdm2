// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from '../store/navbarSlice'; // Импортируем редюсер
import agreementsReducer from './agreementsSlice';
import tabsReducer from './tabsSlice';

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
    agreements_slice: agreementsReducer,
    tabs_slice: tabsReducer,
  },
});

export default store;