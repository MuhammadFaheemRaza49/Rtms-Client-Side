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

const initialState = {
  selectedDate: null,
  selectedTimeSlot: null,
  guestCount: 2,
  specialRequests: '',
  loading: false,
  error: null,
  policyCache: {},
  availabilityCache: {},
  policyLoading: false,
  availabilityLoading: false,
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

    case GET_POLICY_PENDING: {
      const cached = state.policyCache && state.policyCache[action.payload];
      return {
        ...state,
        policyLoading: !cached,
      };
    }
    case GET_POLICY_SUCCESS: {
      const { branchId, policy } = action.payload || {};
      return {
        ...state,
        policyLoading: false,
        policyCache: branchId ? {
          ...state.policyCache,
          [branchId]: policy,
        } : state.policyCache,
      };
    }
    case GET_POLICY_FAILURE:
      return {
        ...state,
        policyLoading: false,
      };

    case GET_AVAILABILITY_PENDING: {
      const cached = state.availabilityCache && state.availabilityCache[action.payload];
      return {
        ...state,
        availabilityLoading: !cached,
      };
    }
    case GET_AVAILABILITY_SUCCESS: {
      const { cacheKey, slots } = action.payload || {};
      return {
        ...state,
        availabilityLoading: false,
        availabilityCache: cacheKey ? {
          ...state.availabilityCache,
          [cacheKey]: slots,
        } : state.availabilityCache,
      };
    }
    case GET_AVAILABILITY_FAILURE:
      return {
        ...state,
        availabilityLoading: false,
      };

    default:
      return state;
  }
};

export default bookingReducer;
