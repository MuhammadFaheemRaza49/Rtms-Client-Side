import { combineReducers } from 'redux';
import tables from './tables';
import booking from './booking';
import restaurant from './restaurant';
import menu from './menu';
import user from './user';
import bookingHistory from './bookingHistory';
import bus from './bus';
import home from './home';
import app from './app';
import airline from './airline';

const rootReducer = combineReducers({
  tables,
  booking,
  restaurant,
  menu,
  user,
  bookingHistory,
  bus,
  home,
  app,
  airline,
});

export default rootReducer;
