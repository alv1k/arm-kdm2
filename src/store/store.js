// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from '../store/navbarSlice'; // Импортируем редюсер

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
  },
});

export default store;