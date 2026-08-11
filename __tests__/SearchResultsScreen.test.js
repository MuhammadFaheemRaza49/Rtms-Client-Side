import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from '../app/store/configureStore';
import SearchResultsScreen from '../app/container/SearchRestaurant/SearchResultsScreen';

// Mock navigation hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { query: 'Splash Dining' },
  }),
}));

// Mock the restaurant operations to prevent async network timers from running past tests
jest.mock('../app/redux/restaurant', () => {
  const actual = jest.requireActual('../app/redux/restaurant');
  return {
    __esModule: true,
    ...actual,
    default: actual.default || actual,
    searchRestaurants: () => (dispatch) => {
      dispatch(actual.searchRestaurantsPending());
      dispatch(
        actual.searchRestaurantsSuccess([
          {
            id: 'nearby-2',
            name: 'Splash Dining Resturant',
            location: 'Lahore, Pakistan',
            rating: 5,
            reviewCount: '5,201',
            startingPrice: '300',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
          },
        ])
      );
    },
  };
});

test('SearchResultsScreen compiles and renders safely', () => {
  let tree;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 375, height: 812 },
            insets: { top: 44, left: 0, right: 0, bottom: 34 },
          }}
        >
          <SearchResultsScreen />
        </SafeAreaProvider>
      </Provider>
    );
  });
  expect(tree).toBeTruthy();
});
