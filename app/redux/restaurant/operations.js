import {
  getHomeListingsPending,
  getHomeListingsSuccess,
  getHomeListingsFailure,
  searchRestaurantsPending,
  searchRestaurantsSuccess,
  searchRestaurantsFailure,
  getRestaurantDetailsPending,
  getRestaurantDetailsSuccess,
  getRestaurantDetailsFailure,
} from './actions';

// Figma-accurate Mock Data
const MOCK_TRENDING = [
  {
    id: 'trending-1',
    name: 'Splash Dining',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  },
  {
    id: 'trending-2',
    name: 'Random Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
  },
  {
    id: 'trending-3',
    name: 'Celano',
    imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80',
  },
];

const MOCK_NEARBY = [
  {
    id: 'nearby-1',
    name: 'Random Coffee Shop With Great Lights',
    location: 'Lahore, Pakistan',
    rating: 5,
    reviewCount: '1,123',
    startingPrice: '300',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
  },
  {
    id: 'nearby-2',
    name: 'Splash Dining Resturant',
    location: 'Lahore, Pakistan',
    rating: 5,
    reviewCount: '5,201',
    startingPrice: '300',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  },
];

const MOCK_FEATURED = [
  {
    id: 'featured-1',
    name: 'Random Coffee Shop With Great Lights',
    location: 'Lahore, Pakistan',
    rating: 5,
    reviewCount: '1,123',
    startingPrice: '300',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
  },
  {
    id: 'featured-2',
    name: 'Splash Dining Resturant',
    location: 'Lahore, Pakistan',
    rating: 5,
    reviewCount: '5,201',
    startingPrice: '300',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  },
];

const MOCK_DETAILS = {
  id: 'nearby-2',
  name: 'Splash Dining Resturant',
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80'
  ],
  rating: 5,
  reviewCount: '5,201',
  cuisineTags: ['International', 'Fine Dining', 'Barbecue'],
  address: 'Lahore, Pakistan',
  hours: '12:00 PM - 11:30 PM',
  about: 'Experience premium visual aesthetics and delicious menus prepared by world-class chefs at Splash Dining.',
  highlights: ['Roof top seating', 'Valet parking', 'Live music'],
  amenities: ['Wheelchair accessible', 'High chairs available', 'Wi-Fi'],
  thingsToKnow: ['Smart casual dress code', 'Reservations held for 15 minutes max'],
  reservationPolicy: ['No cancellation fees up to 2 hours prior'],
  reviews: [
    { id: 'rev-1', userName: 'Muhammad Raza', rating: 5, comment: 'Simply stunning design and food!' }
  ]
};

/**
 * Fetches trending, nearby, and featured restaurant listings for the search landing page.
 */
export const getHomeListings = () => {
  return async (dispatch) => {
    dispatch(getHomeListingsPending());
    try {
      // Simulate API success delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const responseData = {
        trending: MOCK_TRENDING,
        nearby: MOCK_NEARBY,
        featured: MOCK_FEATURED,
      };
      dispatch(getHomeListingsSuccess(responseData));
      return responseData;
    } catch (error) {
      dispatch(getHomeListingsFailure(error.message || 'Failed to fetch home listings'));
      throw error;
    }
  };
};

/**
 * Searches restaurants matching a query, date, and guest count.
 * @param {string} query
 * @param {string} date
 * @param {number} guestCount
 */
export const searchRestaurants = (query, date, guestCount) => {
  return async (dispatch) => {
    dispatch(searchRestaurantsPending());
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Return Splash Dining Resturant as the search result matching the figma
      const searchResults = [
        {
          id: 'nearby-2',
          name: 'Splash Dining Resturant',
          location: 'Lahore, Pakistan',
          rating: 5,
          reviewCount: '5,201',
          startingPrice: '300',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
        }
      ];
      dispatch(searchRestaurantsSuccess(searchResults));
      return searchResults;
    } catch (error) {
      dispatch(searchRestaurantsFailure(error.message || 'Failed to search restaurants'));
      throw error;
    }
  };
};

/**
 * Fetches detail data for a single restaurant profile.
 * @param {string|number} restaurantId
 */
export const getRestaurantDetails = (restaurantId) => {
  return async (dispatch) => {
    dispatch(getRestaurantDetailsPending());
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const details = restaurantId === 'nearby-2' ? MOCK_DETAILS : { ...MOCK_DETAILS, id: restaurantId };
      dispatch(getRestaurantDetailsSuccess(details));
      return details;
    } catch (error) {
      dispatch(getRestaurantDetailsFailure(error.message || 'Failed to fetch details'));
      throw error;
    }
  };
};
