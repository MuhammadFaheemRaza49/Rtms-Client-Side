import RestApi from '../../services/restclient/RestApi';
import * as actions from './actions';
import { apiError } from '../../container/SearchRestaurant/shared/Permissions/Helper/HelperFuncations';
import { Platform } from 'react-native';
import axios from 'axios';
import Constants from '../../common/Constants';
// import * as globals from '../../../globals';
import store from '../../store/configureStore';

export const getAccessToken = () => dispatch => {
  let userName = Platform.OS === 'ios' ? Constants.IOS_USERNAME : Constants.ANDROID_USERNAME;

  let params = {
    username: userName,
    password: Constants.PASSWORD,
  };
  try {
    return RestApi.getAirlineInstance()
      .post('partner/api/auth/token', params)
      .then(json => {
        const { data } = json;
        dispatch(actions.saveAccessToken(data.Token));
        return data;
      })
      .catch(err => {

        console.log("TOKEN_API_ERROR", JSON.stringify(err));
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};


export const getCurrentAirport = (accessToken) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get('air/api/airports/home', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(json => {
        const { data } = json;
        dispatch(actions.saveHomeInfoAirports(data));
        return data;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};



export const getPlatformFee = (accessToken, params) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get('/api/platform-fee', {
        params: params,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(json => {
        const { data } = json;
        if (data?.success) {
          return data?.data;
        }
        return undefined;

      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const getAlliances = (accessToken) => (dispatch) => {
  try {
    return RestApi.getAirlineInstance()
      .get('air/api/alliances', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(json => {
        const { data } = json;
        return data;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const getPopularAirports = (accessToken) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get('air/api/airports/popular', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(json => {
        const { data } = json;
        dispatch(actions.savePopularAirports(data));
        return data;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};



export const getCalenderFares = (accessToken, params) => dispatch => {

  try {
    return RestApi.getAirlineInstance()
      .get('air/api/calendar-fares', {
        params: params,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        dispatch(actions.saveCalendarFares(data?.Fares));
        return data;
      })
      .catch(err => {
        apiError(err, false);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};
export const getTravelGuidance = (accessToken, params) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .post('api/travel-guide', params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        if (response?.data) {
          const { data } = response;
          return data;
        } else {
          apiError(response, false);
          return undefined;
        }
      })
      .catch(err => {
        apiError(err, false);
        console.log(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};


export const getSingleItinerary = (accessToken, params, cancelToken) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get('air/api/session-log/get-itinerary', {
        params: params,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        signal: cancelToken?.signal,
      })
      .then(response => {
        if (response?.data) {
          const { data } = response;
          return data;
        } else {
          apiError(response, false);
          return undefined;
        }
      })
      .catch(err => {
        if (!cancelToken.signal.aborted) {
          apiError(err, false);
          console.log(err);
          return undefined;
        }

        return { cancelled: true, itinerary: undefined }

      });
  } catch (error) {
    return undefined;
  }
};


export const getContentProviders =
  (accessToken, params, searchObj, modifySearchObj = undefined, getProviderFlights, abortController, isModify = false, legwise = true) => async dispatch => {
    try {

      // Fetch content providers
      const response = await RestApi.getAirlineInstance().post(
        'air/api/content-providers',
        params,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        },
      );




      const { data: providers } = response;


      if (!providers || providers.length === 0) {
        dispatch(actions.setLoading(false));
        return undefined;
      }

      dispatch(actions.saveAirlineFilters(null));
      dispatch(actions.setLoading(true));

      let searchPromises = []
      if (isModify && modifySearchObj) {
        searchPromises = providers.map(provider => {
          let paramsObj = {
            api_key: globals.API_KEY,
            api_token: store.getState()?.user?.userInfo?.user?.api_token ?? "",
            "Legs": modifySearchObj.Legs,
            "Passengers": modifySearchObj?.Passengers,
            "TravelingDates": searchObj?.TravelingDates,
            "TravelClass": searchObj?.TravelClass,
            "FlexibleDates": searchObj?.FlexibleDates,
            "ContentProvider": provider?.ContentProvider,
            "LegwiseSearch": legwise
          }

          return dispatch(modifySearchAPI(accessToken, paramsObj, searchObj?.BookingUuid, getProviderFlights, abortController))
            .then(res => {
              if (res) {
                return res;
              }
              return undefined;
            })
            .catch(err => {
              console.error(
                `Error fetching flights for provider ${provider.ContentProvider}:`,
                err,
              );
              return undefined;
            });
        })

      } else {
        // Prepare search parameters for each provider
        searchPromises = providers.map(provider => {
          const paramsObj = {
            api_key: globals.API_KEY,
            api_token: store.getState()?.user?.userInfo?.user?.api_token ?? "",
            Locations: provider.Locations,
            ContentProvider: provider?.ContentProvider,
            Currency: searchObj?.Currency,
            FlexibleDates: searchObj?.FlexibleDates,
            TravelClass: searchObj?.TravelClass,
            Travelers: searchObj?.Travelers,
            TravelingDates: searchObj?.TravelingDates,
            TripType: searchObj?.TripType,
            ForceCache: true,
            LegwiseSearch: legwise
          };
          console.log("paramsObj", paramsObj)
          return dispatch(
            searchFlightApi(accessToken, paramsObj, getProviderFlights, abortController),
          )
            .then(res => {
              if (res) {

                return res;
              }
              return undefined;
            })
            .catch(err => {
              console.error(
                `Error fetching flights for provider ${provider.ContentProvider}:`,
                err,
              );

              return undefined;
            });
        });
      }

      // Track progress
      let completedCount = 0;
      const totalProviders = providers.length;

      // Update progress as each provider responds
      searchPromises.forEach(promise => {
        promise.finally(() => {
          completedCount += 1;
          const progress = completedCount / totalProviders;
          dispatch(actions.saveProgressCount(progress));

          if (completedCount === totalProviders) {
            dispatch(actions.setLoading(false));
            dispatch(actions.saveProgressCount(2)); // Mark as complete
          }
        });
      });

      // Wait for all providers to respond
      const results = await Promise.allSettled(searchPromises);

      // Process results
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          // Handle successful responses
          // getProviderFlights(result.value);
        }
      });

      return results;
    } catch (err) {
      console.error('Error fetching content providers:', err);

      dispatch(actions.setLoading(false));
      apiError(err, false);
      return undefined;
    }
  };




export const searchFlightApi =
  (accessToken, params, getProviderFlights, abortController) => async dispatch => {

    try {
      const response = await RestApi.getAirlineInstance().post(Constants.bookme_sky_url + '/air/api/search', params,
        {
          headers: {

            Authorization: 'Bearer ' + accessToken
          },
          signal: abortController?.current?.signal,
        },
      );
      const { data } = response;
      if (!data) return undefined;

      let filters = makeFilterDataFromResponse(loopingData(data));
      getProviderFlights(filters);

      return filters?.list;
    } catch (error) {
      if (!axios.isCancel(error)) {
        apiError(error, false);
        return undefined;
      }
      console.log(error);
    }
  };

export const searchFlightForBusApi =
  (accessToken, params) => async dispatch => {

    try {
      const response = await RestApi.getAirlineInstance().post(Constants.bookme_sky_url + '/air/api/search', params,
        {
          headers: {

            Authorization: 'Bearer ' + accessToken
          },
        },
      );
      const { data } = response;
      if (!data) return undefined;

      let filters = makeFilterDataFromResponse(loopingData(data));


      return filters?.list;
    } catch (error) {
      if (!axios.isCancel(error)) {
        apiError(error, false);
        return undefined;
      }
      console.log(error);
    }
  };



export const modifySearchAPI =
  (accessToken, params, uuid, getProviderFlights, cancelTokenRef) => async dispatch => {
    try {

      const response = await RestApi.getAirlineInstance().post(
        `air/api/search/${uuid}/options`,
        params,
        {
          headers: { Authorization: 'Bearer ' + accessToken },
          signal: cancelTokenRef?.current?.signal,
        },
      );
      const { data } = response;

      if (!data) return [];
      dispatch(actions.saveModifyChanges({ Charges: data?.Charges, Passengers: data?.Passengers }))
      let filters = makeFilterDataFromResponse(loopingData(data));
      getProviderFlights(filters);


      return filters.list;
    } catch (error) {
      apiError(error, false);
      return [];
    }
  };
export const refundQuoteAPI =
  (accessToken, params, uuid) => async dispatch => {
    try {
      const response = await RestApi.getAirlineInstance().post(
        `air/api/refund/${uuid}/quote`,
        params,
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      );

      const { data } = response;

      return data
    } catch (error) {
      apiError(error, false);
      return undefined;
    }
  };

export const refundProcessAPI =
  (accessToken, params, uuid) => async dispatch => {
    try {

      const response = await RestApi.getAirlineInstance().post(
        `air/api/refund/${uuid}/process`,
        params,
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        },
      );

      const { data } = response;

      return data
    } catch (error) {

      console.log("error", JSON.stringify(error));

      apiError(error, false);
      return undefined;
    }
  }

export const getFares = (accessToken, params, cancelToken) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .post('air/api/get-fares', params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        signal: cancelToken?.signal,
      })
      .then(response => {

        const { data } = response;
        return data;
      })
      .catch(err => {

        if (!cancelToken.signal.aborted) {
          apiError(err, false);
          console.log(err);
          return undefined;
        }
        return { cancelled: true, itinerary: undefined }
      });
  } catch (error) {
    return undefined;
  }
};

export const getMergedLegs = (accessToken, params) => dispatch => {
  try {
    return axios.post(Constants.bookme_sky_url + '/air/api/merge', params, {
      headers: {
        'Content-Type': 'application/json',
        'AppVersion': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        'Locale': store.getState()?.app?.languagee?.lang,
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        console.log("ERROR=>", JSON.stringify(err));
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};


export const getQuotation = (accessToken, params) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .post('air/api/quote', params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err, false);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const getFlightBookingDetail = (accessToken, params) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get('air/api/bookings/get-detail', {
        params: params,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const getRequotation = (accessToken, params) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .post('air/api/requote', params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        if (data) {
          return data;
        } else {
          apiError(response);
        }
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const getAddonsData = (url, params, accessToken) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get(url, {
        params: params,
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        if (data) return data;
        else {
          console.log("response", response);
          // apiError(response)
          return undefined;
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));

        apiError(err, false)
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const saveFlightReservation = (accessToken, params) => dispatch => {
  try {
    dispatch(actions.setLoading(true));
    return RestApi.getAirlineInstance()
      .post('air/api/reserve', params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        dispatch(actions.setLoading(false));
        const { data } = response;
        if (response.status === 200) {
          if (data) {
            return data;
          }
        } else if (response.status === 202) {
          return { data, fullPayment: true };
        } else {
          console.log("RESPONSE_ERROR=>", JSON.stringify(response));
          apiError(response);
          return undefined;
        }
      })
      .catch(err => {
        dispatch(actions.setLoading(false));
        console.log("ERROR=>", JSON.stringify(err));
        apiError(err, true);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

// post-booking flow: fetch the available addons for an already-created
// booking; the response RefID drives the subsequent addon/save-addon calls
export const getBookingAddon = (accessToken, uuid) => dispatch => {
  try {
    return RestApi.getAirlineInstance()
      .get(`air/api/bookings/${uuid}/addon`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err, false);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

// post-booking flow: persist selected addons against an already-created booking
export const saveBookingAddon = (accessToken, uuid, params) => dispatch => {
  try {
    dispatch(actions.setLoading(true));
    return RestApi.getAirlineInstance()
      .post(`air/api/bookings/${uuid}/save-addon`, params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        dispatch(actions.setLoading(false));
        const { data } = response;
        if (response.status === 200) {
          if (data) {
            return data;
          }
        } else if (response.status === 202) {
          return { data, fullPayment: true };
        } else {
          console.log('RESPONSE_ERROR=>', JSON.stringify(response));
          apiError(response);
          return undefined;
        }
      })
      .catch(err => {
        dispatch(actions.setLoading(false));
        console.log('ERROR=>', JSON.stringify(err));
        apiError(err, true);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

export const saveFlightModificationReservation = (accessToken, params, uuid) => dispatch => {
  try {
    dispatch(actions.setLoading(true));
    return RestApi.getAirlineInstance()
      .post(`air/api/reserve/${uuid}`, params, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(response => {
        dispatch(actions.setLoading(false));
        const { data } = response;
        if (response.status === 200) {
          if (data) {
            return data;
          }
        } else if (response.status === 202) {
          return { data, fullPayment: true };
        } else {
          apiError(response);
          return undefined;
        }
      })
      .catch(err => {
        dispatch(actions.setLoading(false));
        apiError(err, true);
        return undefined;
      });
  } catch (error) {
    return undefined;
  }
};

function loopingData(data) {
  let array = [];
  for (let obj of data.Itineraries) {
    obj.MainRefID = data?.RefID;
    obj.IsCached = data?.IsCached;
    obj.CachedValidity = data?.CachedValidity;
    array.push(obj);
  }

  return array;
}


function makeFilterDataFromResponse(data) {
  if (data.length > 0) {
    let newArray = data.sort(
      (a, b) => b.RecommendationScore - a.RecommendationScore,
    );
    return {
      list: newArray,
    };
  }
}
