import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from '../app/store/configureStore';
import RestaurantDetailsScreen from '../app/container/RestaurantDetails/RestaurantDetailsScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { restaurantId: 'nearby-2' },
  }),
}));

// Mock operations thunks to prevent async timers
jest.mock('../app/redux/restaurant', () => {
  const actual = jest.requireActual('../app/redux/restaurant');
  return {
    __esModule: true,
    ...actual,
    default: actual.default || actual,
    getRestaurantDetails: () => (dispatch) => {
      dispatch(actual.getRestaurantDetailsPending());
      dispatch(
        actual.getRestaurantDetailsSuccess({
          id: 'nearby-2',
          name: 'Splash Dining Resturant',
          images: [],
          rating: 4.8,
          reviewCount: '5,120',
          cuisineTags: ['Italian', 'Continental'],
          address: '4-A Ali Road Gulberg II, Lahore',
          hours: '12:00 PM - 11:30 PM',
          about: 'Experience premium visual aesthetics and delicious menus.',
          highlights: ['Rooftop', 'Indoor', 'Live Music'],
          amenities: ['Wifi', 'Valet'],
          thingsToKnow: ['Dress code'],
          reservationPolicy: ['Cancel fee'],
          reviews: [{ id: '1', comment: 'Loved it' }],
        })
      );
    },
  };
});

test('RestaurantDetailsScreen compiles and renders safely', () => {
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
          <RestaurantDetailsScreen />
        </SafeAreaProvider>
      </Provider>
    );
  });
  expect(tree).toBeTruthy();
});
