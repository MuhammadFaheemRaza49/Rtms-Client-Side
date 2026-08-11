import userReducer from '../app/redux/user/reducers';
import {
  setCustomerDetails,
  setVoucherCode,
  toggleUseWalletBalance,
  resetUserCheckoutState,
  applyVoucherPending,
  applyVoucherSuccess,
  applyVoucherFailure,
  getWalletBalanceSuccess,
} from '../app/redux/user/actions';

describe('user Redux Duck', () => {
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

  test('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle SET_CUSTOMER_DETAILS with partial merges', () => {
    // Modify one field
    let nextState = userReducer(
      initialState,
      setCustomerDetails({ fullName: 'Muhammad Raza' })
    );
    expect(nextState.customerDetails).toEqual({
      fullName: 'Muhammad Raza',
      countryCode: '+92',
      phoneNumber: '',
      email: '',
    });

    // Modify another field
    nextState = userReducer(
      nextState,
      setCustomerDetails({ phoneNumber: '3001234567', email: 'raza@test.com' })
    );
    expect(nextState.customerDetails).toEqual({
      fullName: 'Muhammad Raza',
      countryCode: '+92',
      phoneNumber: '3001234567',
      email: 'raza@test.com',
    });
  });

  test('should handle SET_VOUCHER_CODE', () => {
    const nextState = userReducer(initialState, setVoucherCode('PROMO50'));
    expect(nextState.voucherCode).toBe('PROMO50');
  });

  test('should handle TOGGLE_USE_WALLET_BALANCE', () => {
    let nextState = userReducer(initialState, toggleUseWalletBalance());
    expect(nextState.useWalletBalance).toBe(true);

    nextState = userReducer(nextState, toggleUseWalletBalance());
    expect(nextState.useWalletBalance).toBe(false);
  });

  test('should handle GET_WALLET_BALANCE_SUCCESS', () => {
    const nextState = userReducer(initialState, getWalletBalanceSuccess(1500));
    expect(nextState.walletBalance).toBe(1500);
  });

  test('should handle RESET_USER_CHECKOUT_STATE', () => {
    const modifiedState = {
      customerDetails: {
        fullName: 'Test Name',
        countryCode: '+1',
        phoneNumber: '5551234',
        email: 'test@example.com',
      },
      voucherCode: 'PROMO10',
      voucherApplied: { code: 'PROMO10', discountType: 'fixed', value: 10 },
      useWalletBalance: true,
      walletBalance: 500,
      loading: true,
      error: 'some error',
    };
    const nextState = userReducer(modifiedState, resetUserCheckoutState());
    expect(nextState).toEqual(initialState);
  });

  test('should handle APPLY_VOUCHER_PENDING', () => {
    const nextState = userReducer(initialState, applyVoucherPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle APPLY_VOUCHER_SUCCESS', () => {
    const discount = { code: 'PROMO20', value: 20 };
    const stateWithLoading = { ...initialState, loading: true };
    const nextState = userReducer(stateWithLoading, applyVoucherSuccess(discount));
    expect(nextState.loading).toBe(false);
    expect(nextState.voucherApplied).toEqual(discount);
    expect(nextState.error).toBeNull();
  });

  test('should handle APPLY_VOUCHER_FAILURE', () => {
    const stateWithLoading = {
      ...initialState,
      loading: true,
      voucherApplied: { code: 'PROMO20' },
    };
    const nextState = userReducer(
      stateWithLoading,
      applyVoucherFailure('Voucher Expired')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.voucherApplied).toBeNull();
    expect(nextState.error).toBe('Voucher Expired');
  });
});
