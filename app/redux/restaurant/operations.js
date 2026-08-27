import RestApi from '../../services/restclient/RestApi';
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

/**
 * Fetches trending, nearby, and featured restaurant listings for the search landing page.
 * Uses a Cache-First pattern: if listings are already in the Redux store, it skips the loading screen.
 */
export const getHomeListings = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { trending, nearby, featured } = state.restaurant;
    const hasCache = (trending && trending.length > 0) || (nearby && nearby.length > 0) || (featured && featured.length > 0);

    if (!hasCache) {
      dispatch(getHomeListingsPending());
    }

    try {
      // Only query the active production companies to prevent checking 50+ empty test companies
      const activeCompanyIds = ['00000000-0000-7000-8000-000000000010', '019fb7e4-da30-7f8b-9b5e-c717ff066a75'];
      
      const allBranches = [];
      const seenBranchIds = new Set();
      const seenBranchNames = new Set();
      
      await Promise.all(
        activeCompanyIds.map(async (companyId) => {
          try {
            // Fetch all restaurants in this company
            const restaurantsResponse = await RestApi.get(`/portal/companies/${companyId}/restaurants`);
            if (restaurantsResponse && Array.isArray(restaurantsResponse.data)) {
              await Promise.all(
                restaurantsResponse.data.map(async (rest) => {
                  try {
                    // Fetch all branches of this restaurant
                    const branchesResponse = await RestApi.get(`/portal/restaurants/${rest.id}/branches`);
                    if (branchesResponse && Array.isArray(branchesResponse.data)) {
                      for (const branch of branchesResponse.data) {
                        if (branch.status !== 'LIVE') {
                          continue;
                        }
                        const branchName = branch.nameI18n?.en || branch.name || 'Unnamed Branch';
                        const normalizedName = branchName.toLowerCase().trim();
                        if (!seenBranchIds.has(branch.id) && !seenBranchNames.has(normalizedName)) {
                          seenBranchIds.add(branch.id);
                          seenBranchNames.add(normalizedName);
                          allBranches.push({
                            id: branch.id,
                            name: branchName,
                            location: branch.addressI18n?.en || branch.address || 'Unknown Location',
                            rating: 5,
                            reviewCount: '5,201',
                            startingPrice: '300',
                            imageUrl: branch.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
                          });
                        }
                      }
                    }
                  } catch (err) {
                    console.warn(`Failed to fetch branches for restaurant ${rest.id}:`, err.message);
                  }
                })
              );
            }
          } catch (err) {
            console.warn(`Failed to fetch restaurants for company ${companyId}:`, err.message);
          }
        })
      );

      const responseData = {
        trending: allBranches.slice(0, 2),
        nearby: allBranches.slice(2, 6),
        featured: allBranches.slice(6),
        available: allBranches,
      };
      
      dispatch(getHomeListingsSuccess(responseData));
      return responseData;
    } catch (error) {
      if (!hasCache) {
        dispatch(getHomeListingsFailure(error.message || 'Failed to fetch home listings'));
      }
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
      // Only query the active production companies to prevent checking 50+ empty test companies
      const activeCompanyIds = ['00000000-0000-7000-8000-000000000010', '019fb7e4-da30-7f8b-9b5e-c717ff066a75'];
      
      let searchResults = [];
      const seenBranchIds = new Set();
      const seenBranchNames = new Set();
      
      await Promise.all(
        activeCompanyIds.map(async (companyId) => {
          try {
            // Fetch all restaurants in this company
            const restaurantsResponse = await RestApi.get(`/portal/companies/${companyId}/restaurants`);
            if (restaurantsResponse && Array.isArray(restaurantsResponse.data)) {
              await Promise.all(
                restaurantsResponse.data.map(async (rest) => {
                  try {
                    // Fetch all branches of this restaurant
                    const branchesResponse = await RestApi.get(`/portal/restaurants/${rest.id}/branches`);
                    if (branchesResponse && Array.isArray(branchesResponse.data)) {
                      for (const branch of branchesResponse.data) {
                        if (branch.status !== 'LIVE') {
                          continue;
                        }
                        const branchName = branch.nameI18n?.en || branch.name || 'Unnamed Branch';
                        const normalizedName = branchName.toLowerCase().trim();
                        if (!seenBranchIds.has(branch.id) && !seenBranchNames.has(normalizedName)) {
                          seenBranchIds.add(branch.id);
                          seenBranchNames.add(normalizedName);
                          searchResults.push({
                            id: branch.id,
                            name: branchName,
                            location: branch.addressI18n?.en || branch.address || 'Unknown Location',
                            rating: 5,
                            reviewCount: '5,201',
                            startingPrice: '300',
                            imageUrl: branch.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
                          });
                        }
                      }
                    }
                  } catch (err) {
                    console.warn(`Failed to fetch branches for restaurant ${rest.id}:`, err.message);
                  }
                })
              );
            }
          } catch (err) {
            console.warn(`Failed to fetch restaurants for company ${companyId}:`, err.message);
          }
        })
      );
      
      // Perform case-insensitive search filtering and sorting on the client side
      if (query && query.trim() !== '') {
        const queryClean = query.toLowerCase().trim();
        searchResults = searchResults.filter(
          (item) =>
            item.name.toLowerCase().includes(queryClean) ||
            item.location.toLowerCase().includes(queryClean)
        );
        
        // Sort results: Matches that start with the query name show up first
        searchResults.sort((a, b) => {
          const aStarts = a.name.toLowerCase().trim().startsWith(queryClean);
          const bStarts = b.name.toLowerCase().trim().startsWith(queryClean);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.name.localeCompare(b.name);
        });
      }
      
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
  return async (dispatch, getState) => {
    const state = getState();
    const targetId = restaurantId || '00000000-0000-7000-8000-000000000030';

    // Cache-First: Check if details are already in the detailsCache dictionary!
    const isCached = !!(state.restaurant.detailsCache && state.restaurant.detailsCache[targetId]);
    dispatch(getRestaurantDetailsPending(targetId));

    try {
      // Fetch the consolidated full branch profile in 1 single HTTP request!
      const profile = await RestApi.get(`/portal/branches/${targetId}/full-profile`);
      
      const { branch, policy, hours, restaurant } = profile || {};

      let policyText = 'No cancellation fees up to 2 hours prior';
      if (policy && policy.preview) {
        policyText = policy.preview;
      }

      let hoursText = '12:00 PM - 11:30 PM';
      if (Array.isArray(hours) && hours.length > 0) {
        const openDay = hours.find(h => !h.isClosed);
        if (openDay && openDay.ranges && openDay.ranges.length > 0) {
          const range = openDay.ranges[0];
          hoursText = `${range.opensAt.substring(0, 5)} - ${range.closesAt.substring(0, 5)}`;
        }
      }

      const cuisines = restaurant?.restaurantCuisines
        ? restaurant.restaurantCuisines.map(rc => rc.cuisine?.nameI18n?.en || rc.cuisine?.name).filter(Boolean)
        : [];

      const amenitiesList = branch?.branchAmenities
        ? branch.branchAmenities.map(ba => ba.amenity?.nameI18n?.en || ba.amenity?.name).filter(Boolean)
        : [];

      const details = {
        id: branch.id,
        name: branch?.nameI18n?.en || branch?.name || 'Not Available',
        images: branch?.photos && branch.photos.length > 0
          ? branch.photos.map(p => p.url)
          : (branch?.logo ? [branch.logo] : []),
        rating: null,
        reviewCount: null,
        cuisineTags: cuisines.length > 0 ? cuisines : null,
        address: branch?.addressI18n?.en || branch?.address || 'Not Available',
        hours: hoursText,
        about: restaurant?.description?.en || restaurant?.description || branch?.description?.en || branch?.description || null,
        highlights: null,
        amenities: amenitiesList.length > 0 ? amenitiesList : null,
        thingsToKnow: null,
        reservationPolicy: policyText ? [policyText] : null,
        reviews: null,
        depositAmount: policy?.depositRequired ? parseFloat(policy.depositAmount) : 0,
        currency: policy?.currency || 'PKR',
      };
      
      dispatch(getRestaurantDetailsSuccess(details));
      return details;
    } catch (error) {
      if (!isCached) {
        dispatch(getRestaurantDetailsFailure(error.message || 'Failed to fetch details'));
      }
      throw error;
    }
  };
};
