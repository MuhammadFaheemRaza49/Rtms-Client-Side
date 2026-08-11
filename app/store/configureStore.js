import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../redux';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
