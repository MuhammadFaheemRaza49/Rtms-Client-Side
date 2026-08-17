import RestApi from '../../services/restclient/RestApi';
import {
  getTablesPending,
  getTablesSuccess,
  getTablesFailure,
  selectFloor,
} from './actions';

/**
 * Fetch tables and floors for a given restaurant, date, and time slot.
 * @param {string|number} restaurantId
 * @param {string} date
 * @param {string} timeSlot
 */
export const getTables = (restaurantId, date, timeSlot) => {
  return async (dispatch, getState) => {
    dispatch(getTablesPending());
    try {
      const branchId = restaurantId || '00000000-0000-7000-8000-000000000030';
      
      // 1. Fetch floors belonging to the branch (Only 1 API call!)
      const floors = await RestApi.get(`/portal/branches/${branchId}/floors`);
      
      const payload = {
        branchId,
        floors: floors || [],
        tablesByFloor: {},
      };

      dispatch(getTablesSuccess(payload));
      
      // 2. Automatically load tables for the selected or first floor
      if (Array.isArray(floors) && floors.length > 0) {
        const state = getState();
        const selectedFloorId = state.tables?.selectedFloorId;
        const activeFloorId = floors.some(f => f.id === selectedFloorId) ? selectedFloorId : floors[0].id;
        
        dispatch(selectFloor(activeFloorId));
        dispatch(getFloorTables(activeFloorId, date, timeSlot));
      }
      return payload;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch tables';
      dispatch(getTablesFailure(errorMessage));
    }
  };
};

export const getFloorTables = (floorId, date, timeSlot) => {
  return async (dispatch, getState) => {
    const state = getState();
    const alreadyLoaded = state.tables?.tablesByFloor?.[floorId];
    if (alreadyLoaded && alreadyLoaded.length > 0) {
      return; // Skip loading if cached already
    }
    try {
      // Fetch tables for ONLY this floor (Only 1 API call!)
      const tables = await RestApi.get(`/portal/floors/${floorId}/tables`);
      dispatch({
        type: 'tables/GET_FLOOR_TABLES_SUCCESS',
        payload: { floorId, tables: tables || [] },
      });
    } catch (error) {
      console.warn(`Failed to fetch tables for floor ${floorId}:`, error.message);
    }
  };
};

