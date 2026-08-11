import {
  GET_MENU_PENDING,
  GET_MENU_SUCCESS,
  GET_MENU_FAILURE,
  SET_SELECTED_CATEGORY,
} from './types';

export const setSelectedCategory = (category) => ({
  type: SET_SELECTED_CATEGORY,
  payload: category,
});

export const getMenuPending = () => ({
  type: GET_MENU_PENDING,
});

export const getMenuSuccess = (data) => ({
  type: GET_MENU_SUCCESS,
  payload: data,
});

export const getMenuFailure = (error) => ({
  type: GET_MENU_FAILURE,
  payload: error,
});
