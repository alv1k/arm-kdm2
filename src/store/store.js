// store.js
import { configureStore } from '@reduxjs/toolkit';
import navbarReducer from './slices/navbarSlice'; // Импортируем редюсер
import agreementsReducer from './slices/agreementsSlice';
import tabsReducer from './slices/tabsSlice';
import requestsReducer from './slices/requestsSlice';
import userReducer from './slices/userSlice';
import modalReducer from './slices/modalSlice';


const createAuthMiddleware = (navigate) => (store) => (next) => (action) => {
  const token = localStorage.getItem('token'); 
  
  if (!token) {
    console.warn('Токен отсутствует для защищенного действия');
    // Используем переданную функцию навигации
    // navigate('/login');
    // window.location.href = "/login";
    // return; // Прерываем цепочку middleware
  } else {
    console.log('check createAuthMiddleware');

  }
  
  return next(action);
};

// Middleware для логирования действий
const loggingMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action.type);
  return next(action);
};

const store = configureStore({
  reducer: {
    navbar: navbarReducer, // Добавляем редюсер в хранилище
    agreements_slice: agreementsReducer,
    tabs_slice: tabsReducer,
    requests_slice: requestsReducer,
    user_slice: userReducer,
    modal_slice: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(createAuthMiddleware())
      .concat(loggingMiddleware)
});

export default store;