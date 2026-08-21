import bookingReducer from '../app/redux/booking/reducers';
import {
  setSelectedDate,
  setSelectedTimeSlot,
  setGuestCount,
  setSpecialRequests,
  resetBooking,
  createBookingPending,
  createBookingSuccess,
  createBookingFailure,
} from '../app/redux/booking/actions';

describe('booking Redux Duck', () => {
  const initialState = {
    selectedDate: null,
    selectedTimeSlot: null,
    guestCount: 2,
    specialRequests: '',
    loading: false,
    error: null,
    availabilityCache: {},
    availabilityLoading: false,
    policyCache: {},
    policyLoading: false,
  };

  test('should return the initial state', () => {
    expect(bookingReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle SET_SELECTED_DATE', () => {
    const nextState = bookingReducer(initialState, setSelectedDate('2026-07-09'));
    expect(nextState.selectedDate).toBe('2026-07-09');
  });

  test('should handle SET_SELECTED_TIME_SLOT', () => {
    const timeSlot = { label: '02:00 PM', period: 'Lunch' };
    const nextState = bookingReducer(initialState, setSelectedTimeSlot(timeSlot));
    expect(nextState.selectedTimeSlot).toEqual(timeSlot);
  });

  test('should handle SET_GUEST_COUNT', () => {
    const nextState = bookingReducer(initialState, setGuestCount(4));
    expect(nextState.guestCount).toBe(4);
  });

  test('should handle SET_SPECIAL_REQUESTS', () => {
    const nextState = bookingReducer(
      initialState,
      setSpecialRequests('Window seat, please.')
    );
    expect(nextState.specialRequests).toBe('Window seat, please.');
  });

  test('should handle RESET_BOOKING', () => {
    const modifiedState = {
      selectedDate: '2026-07-09',
      selectedTimeSlot: { label: '02:00 PM', period: 'Lunch' },
      guestCount: 6,
      specialRequests: 'Near stage',
      loading: true,
      error: 'some error',
    };
    const nextState = bookingReducer(modifiedState, resetBooking());
    expect(nextState).toEqual(initialState);
  });

  test('should handle CREATE_BOOKING_PENDING', () => {
    const nextState = bookingReducer(initialState, createBookingPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle CREATE_BOOKING_SUCCESS', () => {
    const stateWithLoading = {
      ...initialState,
      loading: true,
      error: 'previous error',
    };
    const nextState = bookingReducer(stateWithLoading, createBookingSuccess({}));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('should handle CREATE_BOOKING_FAILURE', () => {
    const stateWithLoading = {
      ...initialState,
      loading: true,
    };
    const nextState = bookingReducer(
      stateWithLoading,
      createBookingFailure('Failed to create booking')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Failed to create booking');
  });
});
