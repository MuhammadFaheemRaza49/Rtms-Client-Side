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

export const clearSelectedBooking = () => ({
  type: CLEAR_SELECTED_BOOKING,
});

export const getMyBookingsPending = () => ({
  type: GET_MY_BOOKINGS_PENDING,
});

export const getMyBookingsSuccess = (bookings) => ({
  type: GET_MY_BOOKINGS_SUCCESS,
  payload: bookings,
});

export const getMyBookingsFailure = (error) => ({
  type: GET_MY_BOOKINGS_FAILURE,
  payload: error,
});

export const getBookingDetailsPending = () => ({
  type: GET_BOOKING_DETAILS_PENDING,
});

export const getBookingDetailsSuccess = (booking) => ({
  type: GET_BOOKING_DETAILS_SUCCESS,
  payload: booking,
});

export const getBookingDetailsFailure = (error) => ({
  type: GET_BOOKING_DETAILS_FAILURE,
  payload: error,
});

export const cancelBookingPending = () => ({
  type: CANCEL_BOOKING_PENDING,
});

export const cancelBookingSuccess = (bookingId) => ({
  type: CANCEL_BOOKING_SUCCESS,
  payload: bookingId,
});

export const cancelBookingFailure = (error) => ({
  type: CANCEL_BOOKING_FAILURE,
  payload: error,
});
