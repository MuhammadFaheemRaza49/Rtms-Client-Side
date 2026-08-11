import RestApi from '../../services/restclient/RestApi';
import {
  getMyBookingsPending,
  getMyBookingsSuccess,
  getMyBookingsFailure,
  getBookingDetailsPending,
  getBookingDetailsSuccess,
  getBookingDetailsFailure,
  cancelBookingPending,
  cancelBookingSuccess,
  cancelBookingFailure,
} from './actions';

/**
 * Fetches the list of bookings for the user.
 */
export const getMyBookings = () => {
  return async (dispatch) => {
    dispatch(getMyBookingsPending());
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., GET `/bookings`
      const url = '/bookings';
      const response = await RestApi.get(url);

      dispatch(getMyBookingsSuccess(response));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch bookings';
      dispatch(getMyBookingsFailure(errorMessage));
      throw error;
    }
  };
};

/**
 * Fetches detail view of a single booking.
 * @param {string|number} bookingId
 */
export const getBookingDetails = (bookingId) => {
  return async (dispatch) => {
    dispatch(getBookingDetailsPending());
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., GET `/bookings/${bookingId}`
      const url = `/bookings/${bookingId}`;
      const response = await RestApi.get(url);

      dispatch(getBookingDetailsSuccess(response));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch booking details';
      dispatch(getBookingDetailsFailure(errorMessage));
      throw error;
    }
  };
};

/**
 * Cancels a booking reservation.
 * @param {string|number} bookingId
 */
export const cancelBooking = (bookingId) => {
  return async (dispatch) => {
    dispatch(cancelBookingPending());
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., POST `/bookings/${bookingId}/cancel`
      const url = `/bookings/${bookingId}/cancel`;
      const response = await RestApi.post(url);

      // Pass the bookingId so the reducer can update the state list in-place
      dispatch(cancelBookingSuccess(bookingId));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to cancel booking';
      dispatch(cancelBookingFailure(errorMessage));
      throw error;
    }
  };
};
