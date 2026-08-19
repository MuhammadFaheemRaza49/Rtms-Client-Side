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

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TABLES_PENDING: {
      const { branchId, cacheKey } = action.payload || {};
      const isSameBranch = state.branchId === branchId;
      const cached = state.tablesCache && state.tablesCache[cacheKey];
      return {
        ...state,
        loading: !cached,
        error: null,
        branchId,
        floors: cached ? cached.floors : (isSameBranch ? state.floors : []),
        tablesByFloor: cached ? cached.tablesByFloor : (isSameBranch ? state.tablesByFloor : {}),
        selectedFloorId: cached ? cached.selectedFloorId : (isSameBranch ? state.selectedFloorId : null),
        selectedTableIds: isSameBranch ? state.selectedTableIds : [],
      };
    }

    case GET_TABLES_SUCCESS: {
      const floors = action.payload?.floors || [];
      const tablesByFloor = action.payload?.tablesByFloor || {};
      const firstFloorId = floors.length > 0 ? floors[0].id : null;
      const selectedFloorId = state.selectedFloorId && floors.some(f => f.id === state.selectedFloorId) ? state.selectedFloorId : firstFloorId;
      const cacheKey = action.payload?.cacheKey;
      return {
        ...state,
        loading: false,
        error: null,
        branchId: action.payload?.branchId || null,
        floors,
        tablesByFloor,
        selectedFloorId,
        tablesCache: cacheKey ? {
          ...state.tablesCache,
          [cacheKey]: { floors, tablesByFloor, selectedFloorId },
        } : state.tablesCache,
      };
    }

    case GET_TABLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SELECT_FLOOR:
      return {
        ...state,
        selectedFloorId: action.payload,
      };

    case 'tables/GET_FLOOR_TABLES_SUCCESS': {
      const { floorId, tables } = action.payload;
      return {
        ...state,
        tablesByFloor: {
          ...state.tablesByFloor,
          [floorId]: tables,
        },
      };
    }

    case SELECT_TABLE:
      return {
        ...state,
        selectedTableIds: state.selectedTableIds.includes(action.payload)
          ? state.selectedTableIds
          : [...state.selectedTableIds, action.payload],
      };

    case DESELECT_TABLE:
      return {
        ...state,
        selectedTableIds: state.selectedTableIds.filter((id) => id !== action.payload),
      };

    case CLEAR_SELECTED_TABLES:
      return {
        ...state,
        selectedTableIds: [],
      };

    case TOGGLE_JOIN_TABLES:
      return {
        ...state,
        joinTables: !state.joinTables,
      };

    case SET_HIGH_CHAIR_COUNT:
      return {
        ...state,
        additionalNeeds: {
          ...state.additionalNeeds,
          highChairCount: action.payload,
        },
      };

    case TOGGLE_WHEELCHAIR:
      return {
        ...state,
        additionalNeeds: {
          ...state.additionalNeeds,
          wheelchair: !state.additionalNeeds.wheelchair,
        },
      };

    case RESET_TABLE_SELECTION:
      return {
        ...state,
        selectedTableIds: [],
        joinTables: false,
        additionalNeeds: {
          highChairCount: 0,
          wheelchair: false,
        },
      };

    default:
      return state;
  }
};

export default tablesReducer;
