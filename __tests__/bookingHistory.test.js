import bookingHistoryReducer from '../app/redux/bookingHistory/reducers';
import {
  clearSelectedBooking,
  getMyBookingsPending,
  getMyBookingsSuccess,
  getMyBookingsFailure,
  getBookingDetailsPending,
  getBookingDetailsSuccess,
  getBookingDetailsFailure,
  cancelBookingPending,
  cancelBookingSuccess,
  cancelBookingFailure,
} from '../app/redux/bookingHistory/actions';
import store from '../app/store/configureStore';

describe('bookingHistory Redux Duck', () => {
  const initialState = {
    loading: false,
    error: null,
    bookings: [],
    selectedBooking: null,
  };

  test('should return the initial state', () => {
    expect(bookingHistoryReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle GET_MY_BOOKINGS_PENDING', () => {
    const nextState = bookingHistoryReducer(initialState, getMyBookingsPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle GET_MY_BOOKINGS_SUCCESS', () => {
    const mockBookings = [
      { id: 'b1', restaurantName: 'Pizza Bistro', status: 'upcoming' },
    ];
    const nextState = bookingHistoryReducer(
      initialState,
      getMyBookingsSuccess(mockBookings)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.bookings).toEqual(mockBookings);
  });

  test('should handle GET_MY_BOOKINGS_FAILURE', () => {
    const nextState = bookingHistoryReducer(
      initialState,
      getMyBookingsFailure('Error loading')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Error loading');
  });

  test('should handle GET_BOOKING_DETAILS_SUCCESS', () => {
    const mockBooking = { id: 'b1', restaurantName: 'Pizza Bistro', guestCount: 4 };
    const nextState = bookingHistoryReducer(
      initialState,
      getBookingDetailsSuccess(mockBooking)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.selectedBooking).toEqual(mockBooking);
  });

  test('should handle CLEAR_SELECTED_BOOKING', () => {
    const stateWithSelection = {
      ...initialState,
      selectedBooking: { id: 'b1' },
    };
    const nextState = bookingHistoryReducer(
      stateWithSelection,
      clearSelectedBooking()
    );
    expect(nextState.selectedBooking).toBeNull();
  });

  test('should handle CANCEL_BOOKING_SUCCESS and update status in place', () => {
    const currentState = {
      loading: true,
      error: null,
      bookings: [
        { id: 'b1', restaurantName: 'Pizza Bistro', status: 'upcoming' },
        { id: 'b2', restaurantName: 'Burger Club', status: 'upcoming' },
      ],
      selectedBooking: { id: 'b1', restaurantName: 'Pizza Bistro', status: 'upcoming' },
    };

    const nextState = bookingHistoryReducer(currentState, cancelBookingSuccess('b1'));

    expect(nextState.loading).toBe(false);
    // Booking list item b1 status should be updated to 'cancelled'
    expect(nextState.bookings).toEqual([
      { id: 'b1', restaurantName: 'Pizza Bistro', status: 'cancelled' },
      { id: 'b2', restaurantName: 'Burger Club', status: 'upcoming' },
    ]);
    // selectedBooking item b1 status should be updated to 'cancelled'
    expect(nextState.selectedBooking).toEqual({
      id: 'b1',
      restaurantName: 'Pizza Bistro',
      status: 'cancelled',
    });
  });

  test('should handle CANCEL_BOOKING_SUCCESS and leave selectedBooking as-is if ID does not match', () => {
    const currentState = {
      loading: true,
      error: null,
      bookings: [
        { id: 'b1', restaurantName: 'Pizza Bistro', status: 'upcoming' },
        { id: 'b2', restaurantName: 'Burger Club', status: 'upcoming' },
      ],
      selectedBooking: { id: 'b2', restaurantName: 'Burger Club', status: 'upcoming' },
    };

    const nextState = bookingHistoryReducer(currentState, cancelBookingSuccess('b1'));

    expect(nextState.selectedBooking).toEqual({
      id: 'b2',
      restaurantName: 'Burger Club',
      status: 'upcoming',
    });
  });
});

describe('Global Redux Store Configuration', () => {
  test('should load store and rootReducer with all 6 modules registered', () => {
    const state = store.getState();
    expect(state).toHaveProperty('tables');
    expect(state).toHaveProperty('booking');
    expect(state).toHaveProperty('restaurant');
    expect(state).toHaveProperty('menu');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('bookingHistory');
  });

  test('should dispatch and update state in store successfully', () => {
    // Dispatch an action to one of the ducks
    store.dispatch(clearSelectedBooking());
    const state = store.getState();
    expect(state.bookingHistory.selectedBooking).toBeNull();
  });
});
