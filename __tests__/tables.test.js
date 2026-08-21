import tablesReducer from '../app/redux/tables/reducers';
import {
  getTablesPending,
  getTablesSuccess,
  getTablesFailure,
  selectFloor,
  selectTable,
  deselectTable,
  clearSelectedTables,
  toggleJoinTables,
  setHighChairCount,
  toggleWheelchair,
  resetTableSelection,
} from '../app/redux/tables/actions';

describe('tables Redux Duck', () => {
  const initialState = {
    loading: false,
    error: null,
    branchId: null,
    floors: [],
    selectedFloorId: null,
    tablesByFloor: {},
    selectedTableIds: [],
    joinTables: false,
    additionalNeeds: {
      highChairCount: 0,
      wheelchair: false,
    },
    tablesCache: {},
  };

  test('should return the initial state', () => {
    expect(tablesReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle GET_TABLES_PENDING', () => {
    const nextState = tablesReducer(initialState, getTablesPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle GET_TABLES_SUCCESS', () => {
    const mockData = {
      floors: [
        { id: '1', name: 'Main Floor', type: 'indoor' },
        { id: '2', name: 'Terrace', type: 'outdoor' },
      ],
      tablesByFloor: {
        '1': [{ id: 't1', tableNumber: 1, seatCount: 4, status: 'available' }],
      },
    };

    const nextState = tablesReducer(initialState, getTablesSuccess(mockData));
    expect(nextState.loading).toBe(false);
    expect(nextState.floors).toEqual(mockData.floors);
    expect(nextState.tablesByFloor).toEqual(mockData.tablesByFloor);
    // Should default to first floor id
    expect(nextState.selectedFloorId).toBe('1');
  });

  test('should handle GET_TABLES_FAILURE', () => {
    const nextState = tablesReducer(initialState, getTablesFailure('Error fetching'));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Error fetching');
  });

  test('should handle SELECT_FLOOR', () => {
    const nextState = tablesReducer(initialState, selectFloor('2'));
    expect(nextState.selectedFloorId).toBe('2');
  });

  test('should handle SELECT_TABLE (only add if not present)', () => {
    let nextState = tablesReducer(initialState, selectTable('table-1'));
    expect(nextState.selectedTableIds).toEqual(['table-1']);

    // Duplicate selection should not add again
    nextState = tablesReducer(nextState, selectTable('table-1'));
    expect(nextState.selectedTableIds).toEqual(['table-1']);

    // Add another table
    nextState = tablesReducer(nextState, selectTable('table-2'));
    expect(nextState.selectedTableIds).toEqual(['table-1', 'table-2']);
  });

  test('should handle DESELECT_TABLE', () => {
    const stateWithSelection = {
      ...initialState,
      selectedTableIds: ['table-1', 'table-2'],
    };
    const nextState = tablesReducer(stateWithSelection, deselectTable('table-1'));
    expect(nextState.selectedTableIds).toEqual(['table-2']);
  });

  test('should handle CLEAR_SELECTED_TABLES', () => {
    const stateWithSelection = {
      ...initialState,
      selectedTableIds: ['table-1', 'table-2'],
    };
    const nextState = tablesReducer(stateWithSelection, clearSelectedTables());
    expect(nextState.selectedTableIds).toEqual([]);
  });

  test('should handle TOGGLE_JOIN_TABLES', () => {
    let nextState = tablesReducer(initialState, toggleJoinTables());
    expect(nextState.joinTables).toBe(true);

    nextState = tablesReducer(nextState, toggleJoinTables());
    expect(nextState.joinTables).toBe(false);
  });

  test('should handle SET_HIGH_CHAIR_COUNT', () => {
    const nextState = tablesReducer(initialState, setHighChairCount(2));
    expect(nextState.additionalNeeds.highChairCount).toBe(2);
  });

  test('should handle TOGGLE_WHEELCHAIR', () => {
    let nextState = tablesReducer(initialState, toggleWheelchair());
    expect(nextState.additionalNeeds.wheelchair).toBe(true);

    nextState = tablesReducer(nextState, toggleWheelchair());
    expect(nextState.additionalNeeds.wheelchair).toBe(false);
  });

  test('should handle RESET_TABLE_SELECTION (keeps floors/tablesByFloor as-is)', () => {
    const customState = {
      loading: false,
      error: null,
      floors: [{ id: '1', name: 'Main Floor' }],
      selectedFloorId: '1',
      tablesByFloor: { '1': [] },
      selectedTableIds: ['table-1'],
      joinTables: true,
      additionalNeeds: {
        highChairCount: 2,
        wheelchair: true,
      },
    };

    const nextState = tablesReducer(customState, resetTableSelection());
    expect(nextState.selectedTableIds).toEqual([]);
    expect(nextState.joinTables).toBe(false);
    expect(nextState.additionalNeeds).toEqual({
      highChairCount: 0,
      wheelchair: false,
    });
    // keeps floors, selectedFloorId, tablesByFloor
    expect(nextState.floors).toEqual([{ id: '1', name: 'Main Floor' }]);
    expect(nextState.selectedFloorId).toBe('1');
    expect(nextState.tablesByFloor).toEqual({ '1': [] });
  });
});
