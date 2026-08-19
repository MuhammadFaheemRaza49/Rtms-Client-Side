import {
  GET_TABLES_PENDING,
  GET_TABLES_SUCCESS,
  GET_TABLES_FAILURE,
  SELECT_FLOOR,
  SELECT_TABLE,
  DESELECT_TABLE,
  CLEAR_SELECTED_TABLES,
  TOGGLE_JOIN_TABLES,
  SET_HIGH_CHAIR_COUNT,
  TOGGLE_WHEELCHAIR,
  RESET_TABLE_SELECTION,
} from './types';

export const getTablesPending = (data) => ({
  type: GET_TABLES_PENDING,
  payload: data,
});

export const getTablesSuccess = (data) => ({
  type: GET_TABLES_SUCCESS,
  payload: data,
});

export const getTablesFailure = (error) => ({
  type: GET_TABLES_FAILURE,
  payload: error,
});

export const selectFloor = (floorId) => ({
  type: SELECT_FLOOR,
  payload: floorId,
});

export const selectTable = (tableId) => ({
  type: SELECT_TABLE,
  payload: tableId,
});

export const deselectTable = (tableId) => ({
  type: DESELECT_TABLE,
  payload: tableId,
});

export const clearSelectedTables = () => ({
  type: CLEAR_SELECTED_TABLES,
});

export const toggleJoinTables = () => ({
  type: TOGGLE_JOIN_TABLES,
});

export const setHighChairCount = (count) => ({
  type: SET_HIGH_CHAIR_COUNT,
  payload: count,
});

export const toggleWheelchair = () => ({
  type: TOGGLE_WHEELCHAIR,
});

export const resetTableSelection = () => ({
  type: RESET_TABLE_SELECTION,
});
