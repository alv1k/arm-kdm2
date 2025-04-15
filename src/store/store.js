// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from '../store/navbarSlice'; // Импортируем редюсер
import agreementsTypesReducer from './agreementsSlice';

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
    agreements_slice: agreementsTypesReducer,
  },
});

export default store;