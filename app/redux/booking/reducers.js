import {
  SET_SELECTED_DATE,
  SET_SELECTED_TIME_SLOT,
  SET_GUEST_COUNT,
  SET_SPECIAL_REQUESTS,
  RESET_BOOKING,
  CREATE_BOOKING_PENDING,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAILURE,
} from './types';

const initialState = {
  selectedDate: null,
  selectedTimeSlot: null,
  guestCount: 2,
  specialRequests: '',
  loading: false,
  error: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };

    case SET_SELECTED_TIME_SLOT:
      return {
        ...state,
        selectedTimeSlot: action.payload,
      };

    case SET_GUEST_COUNT:
      return {
        ...state,
        guestCount: action.payload,
      };

    case SET_SPECIAL_REQUESTS:
      return {
        ...state,
        specialRequests: action.payload,
      };

    case RESET_BOOKING:
      return {
        ...initialState,
      };

    case CREATE_BOOKING_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CREATE_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default bookingReducer;
