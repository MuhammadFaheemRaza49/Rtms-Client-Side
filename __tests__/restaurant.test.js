import restaurantReducer from '../app/redux/restaurant/reducers';
import {
  setSearchQuery,
  clearSelectedRestaurant,
  searchRestaurantsPending,
  searchRestaurantsSuccess,
  searchRestaurantsFailure,
  getHomeListingsPending,
  getHomeListingsSuccess,
  getHomeListingsFailure,
  getRestaurantDetailsPending,
  getRestaurantDetailsSuccess,
  getRestaurantDetailsFailure,
} from '../app/redux/restaurant/actions';

describe('restaurant Redux Duck', () => {
  const initialState = {
    loading: false,
    error: null,
    searchQuery: '',
    searchResults: [],
    trending: [],
    nearby: [],
    featured: [],
    selectedRestaurant: null,
  };

  test('should return the initial state', () => {
    expect(restaurantReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle SET_SEARCH_QUERY', () => {
    const nextState = restaurantReducer(initialState, setSearchQuery('Italian'));
    expect(nextState.searchQuery).toBe('Italian');
  });

  test('should handle CLEAR_SELECTED_RESTAURANT', () => {
    const stateWithSelection = {
      ...initialState,
      selectedRestaurant: { id: 'r1', name: 'Pasta Place' },
    };
    const nextState = restaurantReducer(
      stateWithSelection,
      clearSelectedRestaurant()
    );
    expect(nextState.selectedRestaurant).toBeNull();
  });

  test('should handle SEARCH_RESTAURANTS_PENDING', () => {
    const nextState = restaurantReducer(initialState, searchRestaurantsPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle SEARCH_RESTAURANTS_SUCCESS', () => {
    const mockResults = [{ id: 'r1', name: 'Pasta Place' }];
    const nextState = restaurantReducer(
      initialState,
      searchRestaurantsSuccess(mockResults)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.searchResults).toEqual(mockResults);
  });

  test('should handle SEARCH_RESTAURANTS_FAILURE', () => {
    const nextState = restaurantReducer(
      initialState,
      searchRestaurantsFailure('Network Error')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Network Error');
  });

  test('should handle GET_HOME_LISTINGS_PENDING', () => {
    const nextState = restaurantReducer(initialState, getHomeListingsPending());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle GET_HOME_LISTINGS_SUCCESS and split data', () => {
    const mockHomePayload = {
      trending: [{ id: 't1', name: 'Trendy Pasta' }],
      nearby: [{ id: 'n1', name: 'Local Bistro' }],
      featured: [{ id: 'f1', name: 'Famous Grill' }],
    };
    const nextState = restaurantReducer(
      initialState,
      getHomeListingsSuccess(mockHomePayload)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.trending).toEqual(mockHomePayload.trending);
    expect(nextState.nearby).toEqual(mockHomePayload.nearby);
    expect(nextState.featured).toEqual(mockHomePayload.featured);
  });

  test('should handle GET_HOME_LISTINGS_FAILURE', () => {
    const nextState = restaurantReducer(
      initialState,
      getHomeListingsFailure('Database Error')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Database Error');
  });

  test('should handle GET_RESTAURANT_DETAILS_PENDING', () => {
    const nextState = restaurantReducer(
      initialState,
      getRestaurantDetailsPending()
    );
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('should handle GET_RESTAURANT_DETAILS_SUCCESS', () => {
    const mockDetail = { id: 'r1', name: 'Pasta Place', cuisineTags: ['Italian'] };
    const nextState = restaurantReducer(
      initialState,
      getRestaurantDetailsSuccess(mockDetail)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.selectedRestaurant).toEqual(mockDetail);
  });

  test('should handle GET_RESTAURANT_DETAILS_FAILURE', () => {
    const nextState = restaurantReducer(
      initialState,
      getRestaurantDetailsFailure('Not Found')
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Not Found');
  });
});
