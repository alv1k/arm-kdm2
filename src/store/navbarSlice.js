import { createSlice } from '@reduxjs/toolkit';

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
    showNavbar: false,
  },
  reducers: {
    toggleNavbar(state) {
      state.showNavbar = !state.showNavbar; // Переключаем состояние
    },
    showNavbar(state) {      
      state.showNavbar = true; // Показываем navbar
    },
    hideNavbar(state) {
      state.showNavbar = false; // Скрываем navbar
    },
  },
});

// Экспортируем действия и редюсер
export const { toggleNavbar, showNavbar, hideNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;