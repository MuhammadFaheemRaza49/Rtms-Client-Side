import {
  SET_SEARCH_QUERY,
  CLEAR_SELECTED_RESTAURANT,
  SEARCH_RESTAURANTS_PENDING,
  SEARCH_RESTAURANTS_SUCCESS,
  SEARCH_RESTAURANTS_FAILURE,
  GET_HOME_LISTINGS_PENDING,
  GET_HOME_LISTINGS_SUCCESS,
  GET_HOME_LISTINGS_FAILURE,
  GET_RESTAURANT_DETAILS_PENDING,
  GET_RESTAURANT_DETAILS_SUCCESS,
  GET_RESTAURANT_DETAILS_FAILURE,
} from './types';

const initialState = {
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
  trending: [],
  nearby: [],
  featured: [],
  selectedRestaurant: null,
  detailsCache: {},
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case CLEAR_SELECTED_RESTAURANT:
      return {
        ...state,
        selectedRestaurant: null,
      };

    case SEARCH_RESTAURANTS_PENDING:
    case GET_HOME_LISTINGS_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_RESTAURANT_DETAILS_PENDING: {
      const cached = state.detailsCache && state.detailsCache[action.payload];
      return {
        ...state,
        loading: !cached,
        error: null,
        selectedRestaurant: cached || null,
      };
    }

    case SEARCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        searchResults: action.payload || [],
      };

    case GET_HOME_LISTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        trending: action.payload?.trending || [],
        nearby: action.payload?.nearby || [],
        featured: action.payload?.featured || [],
      };

    case GET_RESTAURANT_DETAILS_SUCCESS: {
      const details = action.payload || null;
      return {
        ...state,
        loading: false,
        error: null,
        selectedRestaurant: details,
        detailsCache: details ? {
          ...state.detailsCache,
          [details.id]: details,
        } : state.detailsCache,
      };
    }

    case SEARCH_RESTAURANTS_FAILURE:
    case GET_HOME_LISTINGS_FAILURE:
    case GET_RESTAURANT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default restaurantReducer;
