import {
  GET_MY_BOOKINGS_PENDING,
  GET_MY_BOOKINGS_SUCCESS,
  GET_MY_BOOKINGS_FAILURE,
  GET_BOOKING_DETAILS_PENDING,
  GET_BOOKING_DETAILS_SUCCESS,
  GET_BOOKING_DETAILS_FAILURE,
  CANCEL_BOOKING_PENDING,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAILURE,
  CLEAR_SELECTED_BOOKING,
} from './types';

const initialState = {
  loading: false,
  error: null,
  bookings: [],
  selectedBooking: null,
};

const bookingHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_BOOKINGS_PENDING:
    case GET_BOOKING_DETAILS_PENDING:
    case CANCEL_BOOKING_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_MY_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        bookings: action.payload || [],
      };

    case GET_BOOKING_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        selectedBooking: action.payload || null,
      };

    case CANCEL_BOOKING_SUCCESS: {
      const bookingId = action.payload;
      const bookings = state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      const selectedBooking =
        state.selectedBooking && state.selectedBooking.id === bookingId
          ? { ...state.selectedBooking, status: 'cancelled' }
          : state.selectedBooking;

      return {
        ...state,
        loading: false,
        error: null,
        bookings,
        selectedBooking,
      };
    }

    case GET_MY_BOOKINGS_FAILURE:
    case GET_BOOKING_DETAILS_FAILURE:
    case CANCEL_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_SELECTED_BOOKING:
      return {
        ...state,
        selectedBooking: null,
      };

    default:
      return state;
  }
};

export default bookingHistoryReducer;
