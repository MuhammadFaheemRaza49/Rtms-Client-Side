import {
  SET_SELECTED_DATE,
  SET_SELECTED_TIME_SLOT,
  SET_GUEST_COUNT,
  SET_SPECIAL_REQUESTS,
  RESET_BOOKING,
  CREATE_BOOKING_PENDING,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAILURE,
  GET_POLICY_PENDING,
  GET_POLICY_SUCCESS,
  GET_POLICY_FAILURE,
  GET_AVAILABILITY_PENDING,
  GET_AVAILABILITY_SUCCESS,
  GET_AVAILABILITY_FAILURE,
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

export const getPolicyPending = (branchId) => ({
  type: GET_POLICY_PENDING,
  payload: branchId,
});

export const getPolicySuccess = (data) => ({
  type: GET_POLICY_SUCCESS,
  payload: data,
});

export const getPolicyFailure = (error) => ({
  type: GET_POLICY_FAILURE,
  payload: error,
});

export const getAvailabilityPending = (cacheKey) => ({
  type: GET_AVAILABILITY_PENDING,
  payload: cacheKey,
});

export const getAvailabilitySuccess = (data) => ({
  type: GET_AVAILABILITY_SUCCESS,
  payload: data,
});

export const getAvailabilityFailure = (error) => ({
  type: GET_AVAILABILITY_FAILURE,
  payload: error,
});
