// import globals from '../../../globals';
import RestApi from '../../services/restclient/RestApi';
// import {toast} from '../../Omni';
import { saveBusTerminalGalllery, setProgressCounter } from './actions';
import store from '../../store/configureStore';
import axios from 'axios';
import Constants from '../../common/Constants';
import { apiError } from '../../container/SearchRestaurant/shared/Permissions/Helper/HelperFuncations';

export const busBookings = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/bookings/index', JSON.stringify(params))
      .then(response => {
        const { data } = response;
        if (
          data &&
          data.Bookings &&
          data.Bookings.length > 0 &&
          data.Bookings[0].List.length > 0
        ) {
          return data.Bookings[0].List;
        } else {
          return undefined;
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        apiError(err);
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const cricketBooking = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/bookings/index', JSON.stringify(params))
      .then(response => {
        const { data } = response;
        if (
          data &&
          data.Bookings &&
          data.Bookings.length > 0 &&
          data.Bookings[0].List.length > 0
        ) {
          return { list: data.Bookings[0].List, date: response?.headers?.date };
        } else {
          return undefined;
        }
      })
      .catch(err => {
        apiError(err);
        return undefined;
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const getSingleBusBookings = params => dispatch => {
  try {
    let params = {};
    return RestApi.getInstanceV2()
      .post('/bookings/index', params)
      .then(response => {
        const { data } = response;
        if (
          data &&
          data.Bookings &&
          data.Bookings.length > 0 &&
          data.Bookings[0].List.length > 0
        ) {
          return data.Bookings[0].List[0];
        } else {
          return undefined;
        }
      })
      .catch(err => {
        console.log('ERROR', JSON.stringify(err));
        apiError(err);
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const getSingleBusBookingsConfirmation = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/bookings/index', JSON.stringify(params))
      .then(response => {
        const { data } = response;
        if (data && data.Bookings && data.Bookings.length > 0) {
          return data.Bookings[0];
        } else {
          return undefined;
        }
      })
      .catch(err => {
        apiError(err);
        console.log(JSON.stringify(err));
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const submitFeedback = params => dispatch => {
  const formData = new FormData();
  for (let key in params) {
    if (key !== 'params') {
      formData.append(key, params[key]);
    }
  }
  for (let p of params.params) {
    formData.append(p.key, p.value);
  }
  console.log(formData);
  try {
    return RestApi.getInstanceV2()
      .post('/feedback/submitFeedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err);
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};
export const getReviews = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/feedback/getFeedback', params)
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err);
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const getPolicies = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('buses/policy', params)
      .then(response => {
        const { data } = response;
        return data;
      })
      .catch(err => {
        apiError(err);
        // toast(err?.response?.message)
      });
  } catch (e) {
    return undefined;
  }
};

export const getRatingInfo = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/feedback/getQuestions', JSON.stringify(params))
      .then(response => {
        const { data } = response;
        if (data && data.length > 0) {
          return data;
        } else {
          return undefined;
        }
      })
      .catch(err => {
        apiError(err);
      });
  } catch (e) {
    return undefined;
  }
};

export const getSeatInfo = params => dispatch => {
  const url = 'seats_info';
  try {
    return RestApi.formatData(url, params)
      .then(response => {
        return response;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const modifyBusOrder = params => dispatch => {
  try {
    return RestApi.getInstanceV2()
      .post('/buses/modify-trip', params)
      .then(response => {
        const { data } = response;

        if (response.status === 200) {
          if (data) {
            return data;
          }
        } else if (response.status === 202) {
          return { data, fullPayment: true };
        } else {
          return undefined;
        }
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const busSettingApi = params => dispatch => {
  const url = 'settings/index';
  try {
    return RestApi.getInstanceV2()
      .post(url, params)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const promoClaim = params => dispatch => {
  const url = 'vouchers/redeem';
  try {
    return RestApi.getInstanceV2()
      .post(url, params)
      .then(response => {
        return response;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    return undefined;
  }
};

export const getServicesTimeData = (search, signal) => async (dispatch) => {
  try {
    console.log("search=?>", search);
    const state = store.getState();
    const currency = state?.app?.currency?.key;
    // Prepare FormData
    const form = new FormData();
    for (let key in search) {
      if (search[key] !== undefined && search[key] !== null) {
        form.append(key, search[key]);
      }
    }

    form.append('Currency', currency)

    // Gallery params
    const galleryParams = {
      api_key: globals.API_KEY,
      origin_city_id: search?.origin_city_id,
      arrival_city_id: search?.destination_city_id,
      service_id: search?.service_id ?? globals.BUS_SERVICE_ID,
    };

    // API call with cancelToken
    const response = await axios.post(
      `${Constants.url}/REST/API/rest_api.php?bus_times`, // <-- your API endpoint
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': globals.AUTH_TOKEN,
          'App-Version': globals.AppVersion,
          'Funnel-Key': store.getState()?.home?.session_key,
        },
        // cancelToken: signal.current.token,
        signal: signal
      }
    );

    dispatch(getBusAndTerminalGallery(galleryParams));
    if (Array.isArray(response?.data?.times)) {
      return response?.data?.times;
    }
    return undefined;
  } catch (err) {
    console.log("error", err);
    if (axios.isCancel(err)) {
      console.log("Request canceled:", err.message);
      return [];
    }
    apiError(err, false);
    return undefined;
  }
};
// export const getServicesTimeData = (search,signal) => dispatch => {
//   try {
//     const galleryParams = {
//       api_key: globals.API_KEY,
//       origin_city_id: search?.origin_city_id,
//       arrival_city_id: search?.destination_city_id,
//       service_id: 0,
//     };
//
//
//
//     const url = 'bus_times';
//
//
//     return RestApi.formatData(url, search,{
//       cancelToken: signal.current.token
//     })
//       .then(response => {
//         console.log("response",response);
//         dispatch(getBusAndTerminalGallery(galleryParams));
//
//         if (Array.isArray(response?.times)) {
//           return response.times;
//         }
//         return undefined;
//       })
//       .catch(err => {
//         console.log("error", err);
//         if (axios.isCancel(err)) {
//           console.log("Request canceled:", err.message);
//           return [];
//         }
//         apiError(err, false);
//         return undefined;
//       });
//   } catch (e) {
//     console.log("ee", e);
//     console.error(e);
//   }
// };

export const getSpecificServiceTimes = (params, isFrom, item) => dispatch => {
  try {
    const {
      depDate,
      serviceItem,
      origin,
      destination,
      session_id,
      user_id,
      api_token,
      arrDate,
      isOneWay,
    } = params;
    const url = 'bus_times';
    let params2 = {
      api_key: globals.API_KEY,
      service_id: serviceItem.serviceId,
      origin_city_id: isFrom ? origin.id : destination.id,
      arrival_city_id: isFrom ? destination.id : origin.id,
      date: isFrom ? depDate : arrDate,
      user_id: user_id,
      session_id: session_id,
      api_token: api_token,
      returnType: isFrom,
    };

    if (!isFrom) {
      params2 = {
        ...params2,
        outBound: JSON.stringify({
          departure_date: depDate,
          time_id: item?.time_id,
          departure_time: item?.time,
        }),
      };
    }

    const galleryParams = {
      api_key: globals.API_KEY,
      origin_city_id: isFrom ? origin.id : destination.id,
      destination_city_id: isFrom ? destination.id : origin.id,
      service_id: serviceItem.serviceId,
    };
    dispatch(getBusAndTerminalGallery(galleryParams));
    return RestApi.formatData(url, params2)
      .then(response => {
        if ('times' in response && Array.isArray(response.times)) {
          return makeTimeDataFormation(
            response.times,
            isFrom ? depDate : arrDate,
          );
        }
        return [];
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const saveBusOrderApi = params => dispatch => {
  const url = `buses/saveOrders`;
  try {
    return RestApi.getInstanceV2()
      .post(url, params)
      .then(response => {
        const { data } = response;

        if (response.status === 200) {
          if (data) {
            return data;
          }
        } else if (response.status === 202) {
          return { data, fullPayment: true };
        } else {
          return undefined;
        }
      })
      .catch(error => {
        console.log("error", JSON.stringify(error));
        apiError(error);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const getBookingStatusApi = params => dispatch => {
  const url = `bookings/is-pending-booking`;
  try {
    return RestApi.getInstanceV2()
      .post(url, params)
      .then(response => {
        const { data } = response;

        return data;
      })
      .catch(error => {
        console.log(error);
        apiError(error);
        // apiError(error)
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const flexifareApi = params => dispatch => {
  try {
    const url = 'getFlexiFares';
    return RestApi.formatData(url, params)
      .then(response => {
        return response;
      })
      .catch(err => {
        apiError(err);
        return undefined;
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

export const getBusAndTerminalGallery = params => dispatch => {
  const url = `buses/gallery`;
  try {
    return RestApi.getInstanceV2()
      .post(url, params)
      .then(response => {
        const { data } = response;
        dispatch(saveBusTerminalGalllery(data));
        return data;
      })
      .catch(error => {
        apiError(error, false);
      });
  } catch (e) {
    apiError(e);
    return undefined;
  }
};

function getFormatedBusBooking(data) {
  console.log('total', data.length);

  let oneWay = [];
  let twoWay = [];
  for (let b of data) {
    if (
      data.filter(
        item =>
          item.order_mutual_id === b.order_mutual_id &&
          item.order_id !== b.order_id,
      ).length > 0
    ) {
      let obj = data.filter(
        item =>
          item.order_mutual_id == b.order_mutual_id &&
          item.order_id != b.order_id,
      )[0];
      twoWay.push({
        inBound: b,
        outBound: obj,
      });
    } else {
      oneWay.push(b);
    }
  }
  // console.log("oneWay",JSON.stringify(oneWay))
  // console.log("TwoWay",JSON.stringify(twoWay))
  return {
    oneWay,
    twoWay,
  };
}

const makeTimeDataFormation = (totalData, date) => {
  let minFare = totalData[0]?.fare ?? 0;
  let maxFare = totalData[0]?.fare ?? 0;
  let allFacilities = [];
  let busType = [];
  let timesList = [];

  totalData.forEach((time, index) => {
    if (time.is_connecting) {
      if (time.segment && time.segment.length > 0) {
        let collectiveTime = time.segment.reduce(
          (pre, curr, index) =>
            pre +
            parseInt(curr.time.split(':')[0]) * 60 +
            parseInt(curr.time.split(':')[1]),
          0,
        );
        let collectiveBusTypes = [];

        time.segment.forEach((innerTime, i) => {
          innerTime.dep_time_minutes = collectiveTime;
          innerTime.date = date;
          // collectiveBusTypes.push({isSelected: true, title: innerTime.busname})
        });

        timesList.push({ ...time, id: index, date });
        if (time.fare > maxFare) {
          maxFare = time.fare;
        } else if (time.fare < minFare) {
          minFare = time.fare;
        }
        busType = [];
        allFacilities = [];
      } else {
        return {
          priceRange: [minFare, maxFare],
          facilities: [],
          busType: [],
          times: [],
        };
      }
    } else {
      const dep_time_minutes =
        parseInt(time.time.split(':')[0]) * 60 +
        parseInt(time.time.split(':')[1]);
      timesList.push({ ...time, dep_time_minutes, id: index, date });
      if (time.fare > maxFare) {
        maxFare = time.fare;
      } else if (time.fare < minFare) {
        minFare = time.fare;
      }
      allFacilities = allFacilities.concat(time.facilities);
      busType.push({ isSelected: true, title: time.busname });
    }
  });

  const uniqueFacilities = allFacilities.filter(
    (thing, index, self) => index === self.findIndex(t => t.id == thing.id),
  );
  const uniqueBusType = busType.filter(
    (thing, index, self) =>
      index === self.findIndex(t => t.title === thing.title),
  );

  const facilities = uniqueFacilities.map(facility => {
    return {
      ...facility,
      isSelected: false,
    };
  });

  return {
    priceRange: [minFare, maxFare],
    facilities: facilities,
    busType: uniqueBusType,
    times: timesList,
  };
};

export const requestCancelAirlineTicket = params => dispatch => {
  try {
    // dispatch(actions.isPending(true))
    return RestApi.getInstanceV2()
      .put('airlines/request_refund', JSON.stringify(params))
      .then(response => {
        // dispatch(actions.isPending(false))
        return response?.data;
      })
      .catch(err => {
        console.log(err);
        if (err?.response?.status === 422 && err?.response?.data) {
          var errorString = '';
          for (let obj of Object.keys(err?.response?.data)) {
            errorString += err?.response?.data[obj];
          }
          toast(errorString, 3000);
        } else {
          apiError(err);
        }
        // dispatch(actions.isPending(false))
        return undefined;
      });
  } catch (e) {
    // actions.isPending(false)
    return undefined;
  }
};
