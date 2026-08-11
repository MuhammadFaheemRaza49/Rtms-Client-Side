import RestApi from '../../services/restclient/RestApi';
import {
  getTablesPending,
  getTablesSuccess,
  getTablesFailure,
} from './actions';

/**
 * Fetch tables and floors for a given restaurant, date, and time slot.
 * @param {string|number} restaurantId
 * @param {string} date
 * @param {string} timeSlot
 */
export const getTables = (restaurantId, date, timeSlot) => {
  return async (dispatch) => {
    dispatch(getTablesPending());
    try {
      // Placeholder endpoint URL. Update this path and parameter names when the backend is finalized.
      // E.g., GET `/restaurants/${restaurantId}/tables?date=${date}&timeSlot=${timeSlot}`
      const url = `/restaurants/${restaurantId}/tables`;
      
      const response = await RestApi.get(url, {
        params: {
          date,
          timeSlot,
        },
      });

      // The reducer expects the response payload to contain:
      // { floors: [...], tablesByFloor: {...} }
      dispatch(getTablesSuccess(response));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch tables';
      dispatch(getTablesFailure(errorMessage));
    }
  };
};
