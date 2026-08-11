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

export const setSelectedDate = (date) => ({
  type: SET_SELECTED_DATE,
  payload: date,
});

export const setSelectedTimeSlot = (slot) => ({
  type: SET_SELECTED_TIME_SLOT,
  payload: slot,
});

export const setGuestCount = (count) => ({
  type: SET_GUEST_COUNT,
  payload: count,
});

export const setSpecialRequests = (text) => ({
  type: SET_SPECIAL_REQUESTS,
  payload: text,
});

export const resetBooking = () => ({
  type: RESET_BOOKING,
});

export const createBookingPending = () => ({
  type: CREATE_BOOKING_PENDING,
});

export const createBookingSuccess = (response) => ({
  type: CREATE_BOOKING_SUCCESS,
  payload: response,
});

export const createBookingFailure = (error) => ({
  type: CREATE_BOOKING_FAILURE,
  payload: error,
});
