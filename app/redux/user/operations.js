import RestApi from '../../services/restclient/RestApi';
import {
  applyVoucherPending,
  applyVoucherSuccess,
  applyVoucherFailure,
  getWalletBalanceSuccess,
} from './actions';

/**
 * Validates and applies a voucher code.
 * @param {string} code
 */
export const applyVoucher = (code) => {
  return async (dispatch) => {
    dispatch(applyVoucherPending());
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., POST `/vouchers/apply`
      const url = '/vouchers/apply';
      const response = await RestApi.post(url, { code });

      dispatch(applyVoucherSuccess(response));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to apply voucher';
      dispatch(applyVoucherFailure(errorMessage));
      throw error;
    }
  };
};

/**
 * Fetches the current customer's wallet balance.
 */
export const getWalletBalance = () => {
  return async (dispatch) => {
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., GET `/user/wallet-balance`
      const url = '/user/wallet-balance';
      const response = await RestApi.get(url);

      // Support response shapes like { balance: 3000 } or a plain number 3000
      const balance =
        typeof response === 'object' && response !== null
          ? response.balance
          : response;

      dispatch(getWalletBalanceSuccess(balance));
      return balance;
    } catch (error) {
      console.warn('Failed to fetch wallet balance:', error);
      throw error;
    }
  };
};
