import {
  GET_MENU_PENDING,
  GET_MENU_SUCCESS,
  GET_MENU_FAILURE,
  SET_SELECTED_CATEGORY,
} from './types';

const initialState = {
  loading: false,
  error: null,
  categories: [],
  selectedCategory: 'All',
  items: [],
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case GET_MENU_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_MENU_SUCCESS: {
      const payloadCategories = action.payload?.categories || [];
      const categories = [...payloadCategories];
      if (!categories.includes('All')) {
        categories.unshift('All');
      }

      return {
        ...state,
        loading: false,
        error: null,
        categories,
        items: action.payload?.items || [],
        // Reset category filter on fresh menu load to prevent stuck states
        selectedCategory: 'All',
      };
    }

    case GET_MENU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default menuReducer;
