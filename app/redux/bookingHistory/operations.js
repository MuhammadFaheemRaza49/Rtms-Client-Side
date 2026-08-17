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
 * Normalizes a raw booking object from the backend into the shape
 * expected by the client screens (date, startTime, endTime, status lowercase).
 */
const normalizeBooking = (raw) => {
  if (!raw) return raw;

  const startsAt = raw.startsAt ? new Date(raw.startsAt) : null;
  const endsAt = raw.endsAt ? new Date(raw.endsAt) : null;

  const pad = (n) => String(n).padStart(2, '0');
  const formatTime = (d) => d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '';
  const formatDate = (d) => d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';

  return {
    ...raw,
    date: formatDate(startsAt),
    startTime: formatTime(startsAt),
    endTime: formatTime(endsAt),
    status: raw.status ? raw.status.toLowerCase() : 'pending',
    restaurantName: raw.restaurantName || raw.branchName || 'Restaurant',
    specialRequests: raw.notes || raw.specialRequests || '',
  };
};

/**
 * Fetches the list of bookings for the user.
 * @param {string} branchId
 */
export const getMyBookings = (branchId) => {
  return async (dispatch) => {
    dispatch(getMyBookingsPending());
    try {
      const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
      const url = `/portal/branches/${activeBranchId}/bookings`;
      const response = await RestApi.get(url);

      // Normalize each booking from the backend response
      const bookings = Array.isArray(response)
        ? response.map(normalizeBooking)
        : [];

      dispatch(getMyBookingsSuccess(bookings));
      return bookings;
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
 * @param {string} branchId
 */
export const getBookingDetails = (bookingId, branchId) => {
  return async (dispatch) => {
    dispatch(getBookingDetailsPending());
    try {
      const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
      const url = `/portal/branches/${activeBranchId}/bookings/${bookingId}`;
      const response = await RestApi.get(url);

      // Normalize the single booking detail
      const booking = normalizeBooking(response);

      dispatch(getBookingDetailsSuccess(booking));
      return booking;
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
 * @param {string} branchId
 * @param {string} reason
 */
export const cancelBooking = (bookingId, branchId, reason = 'User cancellation') => {
  return async (dispatch) => {
    dispatch(cancelBookingPending());
    try {
      const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
      const url = `/portal/branches/${activeBranchId}/bookings/${bookingId}/cancel`;
      const response = await RestApi.post(url, { reason });

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
