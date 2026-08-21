import { createSelector } from '@reduxjs/toolkit';

const selectRestaurantState = (state) => state.restaurant;

export const selectTrending = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.trending || []
);

export const selectNearby = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.nearby || []
);

export const selectFeatured = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.featured || []
);

export const selectAvailable = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.available || []
);

export const selectSearchResults = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.searchResults || []
);

export const selectRestaurantLoading = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.loading
);

export const selectRestaurantError = createSelector(
  [selectRestaurantState],
  (restaurant) => restaurant.error
);
