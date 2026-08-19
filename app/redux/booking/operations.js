import RestApi from '../../services/restclient/RestApi';
import {
  createBookingPending,
  createBookingSuccess,
  createBookingFailure,
  getPolicyPending,
  getPolicySuccess,
  getPolicyFailure,
  getAvailabilityPending,
  getAvailabilitySuccess,
  getAvailabilityFailure,
} from './actions';

/**
 * Creates a new booking reservation.
 * Converts the client-side booking state into the backend CreateBookingDto shape:
 *   { customer, partySize, startsAt, durationMin, tableIds, notes, source }
 *
 * @param {object} bookingPayload - Client-side booking data
 * @param {string} branchId
 */
export const createBooking = (bookingPayload, branchId) => {
  return async (dispatch, getState) => {
    dispatch(createBookingPending());
    try {
      const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
      const url = `/portal/branches/${activeBranchId}/bookings`;

      // Generate simple custom UUID-like string for the Idempotency-Key
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Build ISO startsAt from date + startTime
      let startsAtIso;
      if (bookingPayload.date && bookingPayload.startTime) {
        startsAtIso = `${bookingPayload.date}T${bookingPayload.startTime}:00.000Z`;
      } else if (bookingPayload.startsAt) {
        startsAtIso = bookingPayload.startsAt;
      } else {
        // Fallback: use today at 18:00
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        startsAtIso = `${yyyy}-${mm}-${dd}T18:00:00.000Z`;
      }

      // Calculate duration in minutes from startTime/endTime, or use default
      let durationMin = 90;
      if (bookingPayload.startTime && bookingPayload.endTime) {
        const [sh, sm] = bookingPayload.startTime.split(':').map(Number);
        const [eh, em] = bookingPayload.endTime.split(':').map(Number);
        const calculated = (eh * 60 + em) - (sh * 60 + sm);
        if (calculated > 0) {
          durationMin = calculated;
        }
      }

      // Get customer details from user redux state
      const state = getState();
      const customerDetails = state.user?.customerDetails || {};

      // Build the backend-compatible payload
      const backendPayload = {
        customer: {
          phoneE164: customerDetails.countryCode && customerDetails.phoneNumber
            ? `${customerDetails.countryCode}${customerDetails.phoneNumber}`
            : '+920000000000',
          fullName: customerDetails.fullName || 'Guest Customer',
          email: customerDetails.email || undefined,
          preferredLocale: 'en',
        },
        partySize: bookingPayload.partySize || 2,
        startsAt: startsAtIso,
        durationMin,
        tableIds: bookingPayload.tableIds || [],
        source: 'STAFF',
        notes: bookingPayload.specialRequests || bookingPayload.notes || undefined,
      };

      const response = await RestApi.post(url, backendPayload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });

      dispatch(createBookingSuccess(response));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create booking';
      dispatch(createBookingFailure(errorMessage));
      throw error;
    }
  };
};

export const getBookingPolicy = (branchId) => {
  return async (dispatch, getState) => {
    const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
    const state = getState();
    const isCached = !!(state.booking?.policyCache && state.booking.policyCache[activeBranchId]);
    dispatch(getPolicyPending(activeBranchId));
    try {
      const response = await RestApi.get(`/portal/branches/${activeBranchId}/booking-policy`);
      dispatch(getPolicySuccess({ branchId: activeBranchId, policy: response }));
      return response;
    } catch (error) {
      dispatch(getPolicyFailure(error.message || 'Failed to fetch policy'));
      throw error;
    }
  };
};

export const getAvailability = (branchId, date, partySize, duration) => {
  return async (dispatch, getState) => {
    const activeBranchId = branchId || '00000000-0000-7000-8000-000000000030';
    const cacheKey = `${activeBranchId}_${date}_${partySize}`;
    const state = getState();
    const isCached = !!(state.booking?.availabilityCache && state.booking.availabilityCache[cacheKey]);
    dispatch(getAvailabilityPending(cacheKey));
    try {
      const response = await RestApi.get(`/portal/branches/${activeBranchId}/availability`, {
        params: {
          date,
          partySize,
          duration,
        },
      });
      dispatch(getAvailabilitySuccess({ cacheKey, slots: response?.slots || [] }));
      return response;
    } catch (error) {
      dispatch(getAvailabilityFailure(error.message || 'Failed to fetch availability'));
      throw error;
    }
  };
};
