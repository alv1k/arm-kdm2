import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabsList: [
      { title_ru: 'Все', title_en: 'all' },
      { title_ru: 'Действующие', title_en: 'active' },
      { title_ru: 'Неактуальные', title_en: 'inactive' }
    ],
  },
  reducers: {
    toggleTabs(state, action) {
      state.showNavbar = !state.showNavbar; // Переключаем состояние
    },
  },
});

// Экспортируем действия и редюсер
export const { toggleTabs } = tabSlice.actions;
export default tabSlice.reducer;