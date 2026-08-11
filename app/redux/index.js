import { combineReducers } from 'redux';
import tables from './tables';
import booking from './booking';
import restaurant from './restaurant';
import menu from './menu';
import user from './user';
import bookingHistory from './bookingHistory';

const rootReducer = combineReducers({
  tables,
  booking,
  restaurant,
  menu,
  user,
  bookingHistory,
});

export default rootReducer;
