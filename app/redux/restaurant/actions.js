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

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const clearSelectedRestaurant = () => ({
  type: CLEAR_SELECTED_RESTAURANT,
});

export const searchRestaurantsPending = () => ({
  type: SEARCH_RESTAURANTS_PENDING,
});

export const searchRestaurantsSuccess = (data) => ({
  type: SEARCH_RESTAURANTS_SUCCESS,
  payload: data,
});

export const searchRestaurantsFailure = (error) => ({
  type: SEARCH_RESTAURANTS_FAILURE,
  payload: error,
});

export const getHomeListingsPending = () => ({
  type: GET_HOME_LISTINGS_PENDING,
});

export const getHomeListingsSuccess = (data) => ({
  type: GET_HOME_LISTINGS_SUCCESS,
  payload: data,
});

export const getHomeListingsFailure = (error) => ({
  type: GET_HOME_LISTINGS_FAILURE,
  payload: error,
});

export const getRestaurantDetailsPending = (restaurantId) => ({
  type: GET_RESTAURANT_DETAILS_PENDING,
  payload: restaurantId,
});

export const getRestaurantDetailsSuccess = (data) => ({
  type: GET_RESTAURANT_DETAILS_SUCCESS,
  payload: data,
});

export const getRestaurantDetailsFailure = (error) => ({
  type: GET_RESTAURANT_DETAILS_FAILURE,
  payload: error,
});
