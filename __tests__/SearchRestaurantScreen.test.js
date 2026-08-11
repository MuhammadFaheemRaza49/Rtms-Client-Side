import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from '../app/store/configureStore';
import SearchRestaurantScreen from '../app/container/SearchRestaurant/SearchRestaurantScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the operations so they don't perform actual API calls during render testing
jest.mock('../app/redux/restaurant', () => {
  const actual = jest.requireActual('../app/redux/restaurant');
  return {
    __esModule: true,
    ...actual,
    default: actual.default || actual, // Ensure the reducer default export is preserved
    getHomeListings: () => (dispatch) => {
      dispatch(actual.getHomeListingsPending());
      // Populate state with mock listings immediately
      dispatch(
        actual.getHomeListingsSuccess({
          trending: [
            { id: 't1', name: 'Splash Dining', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' },
            { id: 't2', name: 'Random Coffee', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
          ],
          nearby: [
            {
              id: 'n1',
              name: 'Random Coffee Shop With Great Lights',
              location: 'Lahore, Pakistan',
              rating: 5,
              reviewCount: '1,123',
              startingPrice: '300',
              imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
            },
          ],
          featured: [
            {
              id: 'f1',
              name: 'Featured Grill',
              location: 'Lahore, Pakistan',
              rating: 4.8,
              reviewCount: '500',
              startingPrice: '250',
              imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
            },
          ],
        })
      );
    },
    getRestaurantDetails: jest.fn(),
  };
});

test('SearchRestaurantScreen compiles and renders safely with mock data', () => {
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
          <SearchRestaurantScreen />
        </SafeAreaProvider>
      </Provider>
    );
  });
  expect(tree).toBeTruthy();
});
