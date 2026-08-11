import RestApi from '../../services/restclient/RestApi';
import {
  createBookingPending,
  createBookingSuccess,
  createBookingFailure,
} from './actions';

/**
 * Creates a new booking reservation.
 * @param {object} bookingPayload
 */
export const createBooking = (bookingPayload) => {
  return async (dispatch) => {
    dispatch(createBookingPending());
    try {
      // Placeholder endpoint URL. Update this path when backend is finalized.
      // E.g., POST `/bookings`
      const url = '/bookings';
      
      const response = await RestApi.post(url, bookingPayload);

      dispatch(createBookingSuccess(response));
      return response; // Return response to let screens access it for success flows
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create booking';
      dispatch(createBookingFailure(errorMessage));
      throw error; // Re-throw to allow component-level error catching if needed
    }
  };
};
