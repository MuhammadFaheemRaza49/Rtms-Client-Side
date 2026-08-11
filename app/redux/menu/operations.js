import RestApi from '../../services/restclient/RestApi';
import {
  getMenuPending,
  getMenuSuccess,
  getMenuFailure,
} from './actions';

/**
 * Fetches the categories and menu items for a specific restaurant.
 * @param {string|number} restaurantId
 */
export const getMenu = (restaurantId) => {
  return async (dispatch) => {
    dispatch(getMenuPending());
    try {
      // Placeholder endpoint URL. Update when backend is finalized. E.g., GET `/restaurants/${restaurantId}/menu`
      const url = `/restaurants/${restaurantId}/menu`;
      const response = await RestApi.get(url);

      dispatch(getMenuSuccess(response));
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch menu';
      dispatch(getMenuFailure(errorMessage));
      throw error;
    }
  };
};
