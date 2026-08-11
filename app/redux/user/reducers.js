import {
  SET_CUSTOMER_DETAILS,
  SET_VOUCHER_CODE,
  TOGGLE_USE_WALLET_BALANCE,
  RESET_USER_CHECKOUT_STATE,
  APPLY_VOUCHER_PENDING,
  APPLY_VOUCHER_SUCCESS,
  APPLY_VOUCHER_FAILURE,
  GET_WALLET_BALANCE_SUCCESS,
} from './types';

const initialState = {
  customerDetails: {
    fullName: '',
    countryCode: '+92',
    phoneNumber: '',
    email: '',
  },
  voucherCode: '',
  voucherApplied: null,
  useWalletBalance: false,
  walletBalance: 0,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMER_DETAILS:
      return {
        ...state,
        customerDetails: {
          ...state.customerDetails,
          ...action.payload,
        },
      };

    case SET_VOUCHER_CODE:
      return {
        ...state,
        voucherCode: action.payload,
      };

    case TOGGLE_USE_WALLET_BALANCE:
      return {
        ...state,
        useWalletBalance: !state.useWalletBalance,
      };

    case GET_WALLET_BALANCE_SUCCESS:
      return {
        ...state,
        walletBalance: action.payload || 0,
      };

    case RESET_USER_CHECKOUT_STATE:
      return {
        ...initialState,
      };

    case APPLY_VOUCHER_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case APPLY_VOUCHER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        voucherApplied: action.payload || null,
      };

    case APPLY_VOUCHER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        voucherApplied: null,
      };

    default:
      return state;
  }
};

export default userReducer;
