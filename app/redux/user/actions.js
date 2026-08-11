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

export const setCustomerDetails = (fieldsObject) => ({
  type: SET_CUSTOMER_DETAILS,
  payload: fieldsObject,
});

export const setVoucherCode = (code) => ({
  type: SET_VOUCHER_CODE,
  payload: code,
});

export const toggleUseWalletBalance = () => ({
  type: TOGGLE_USE_WALLET_BALANCE,
});

export const resetUserCheckoutState = () => ({
  type: RESET_USER_CHECKOUT_STATE,
});

export const applyVoucherPending = () => ({
  type: APPLY_VOUCHER_PENDING,
});

export const applyVoucherSuccess = (discountObj) => ({
  type: APPLY_VOUCHER_SUCCESS,
  payload: discountObj,
});

export const applyVoucherFailure = (error) => ({
  type: APPLY_VOUCHER_FAILURE,
  payload: error,
});

export const getWalletBalanceSuccess = (balance) => ({
  type: GET_WALLET_BALANCE_SUCCESS,
  payload: balance,
});
