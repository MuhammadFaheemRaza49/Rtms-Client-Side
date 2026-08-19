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
    const branchId = restaurantId || '00000000-0000-7000-8000-000000000030';
    const timeStr = timeSlot?.label || '';
    const cacheKey = `${branchId}_${date || ''}_${timeStr}`;

    dispatch(getTablesPending({ branchId, cacheKey }));
    try {
      // Fetch branch status including floors, tables, and bookings for target date & time
      const response = await RestApi.get(`/portal/branches/${branchId}/tables/status?date=${date || ''}&time=${timeStr}`);
      
      // Filter out empty floors that have no tables to match manager layout and keep UX clean
      const floors = (response.floors || []).filter(f => f.tables && f.tables.length > 0);
      const tablesByFloor = {};
      
      if (Array.isArray(floors)) {
        floors.forEach((floor) => {
          tablesByFloor[floor.floorId] = floor.tables || [];
        });
      }
      
      const payload = {
        branchId,
        cacheKey,
        floors,
        tablesByFloor,
      };

      dispatch(getTablesSuccess(payload));
      
      if (floors.length > 0) {
        const state = getState();
        const selectedFloorId = state.tables?.selectedFloorId;
        const activeFloorId = floors.some(f => f.floorId === selectedFloorId || f.id === selectedFloorId)
          ? selectedFloorId
          : floors[0].floorId;
        
        dispatch(selectFloor(activeFloorId));
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
      const branchId = state.tables?.branchId || '00000000-0000-7000-8000-000000000030';
      const timeStr = timeSlot?.label || '';
      const response = await RestApi.get(`/portal/branches/${branchId}/tables/status?date=${date || ''}&time=${timeStr}`);
      const floor = response.floors?.find(f => f.floorId === floorId);
      dispatch({
        type: 'tables/GET_FLOOR_TABLES_SUCCESS',
        payload: { floorId, tables: floor?.tables || [] },
      });
    } catch (error) {
      console.warn(`Failed to fetch tables for floor ${floorId}:`, error.message);
    }
  };
};
