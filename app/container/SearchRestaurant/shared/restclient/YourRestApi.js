import axios from 'axios';

import {AsyncStorage} from 'react-native';
import * as globals from '../../../../../globals';
import {Constants} from '../../../../common';
import store from '../../../../store/configureStore';

export default class YourRestApi {
  constructor() {

    instance = axios.create({
      baseURL: `${Constants.url}/REST/API/rest_api.php?`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'Content-Type': 'multipart/form-data',
        'App-Version': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });
    instanceV2 = axios.create({
      baseURL: `${Constants.url}/api/v2`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'Content-Type': 'application/json',
        'App-Version': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });
    instanceV3 = axios.create({
      baseURL: `${Constants.url}/api/v2`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'Content-Type': 'multipart/form-data',
        'App-Version': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });
    instanceV8 = axios.create({
      baseURL: `${Constants.url}/api/v2`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
        'Content-Type': 'application/json',
        'App-Version': globals.AppVersion,
      },
    });
    instanceV4 = axios.create({
      baseURL: `${Constants.url}/api/v1`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'App-Version': globals.AppVersion,
        'Content-Type': 'multipart/form-data',
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });

    instanceV5 = axios.create({
      baseURL: `${Constants.url}/api`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'App-Version': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });
    instanceUat = axios.create({
      baseURL: `${Constants.bookme_js_uat_url}`,
      timeout: 50000,
      headers: {
        Authorization: globals.AUTH_TOKEN,
        'Content-Type': 'application/json',
        'App-Version': globals.AppVersion,
        'Funnel-Key': store.getState()?.home?.session_key,
        'Accept-Language': store.getState()?.app?.languagee?.lang,
        Locale: store.getState()?.app?.languagee?.lang,
        'Region-Iso':
          store.getState()?.user?.userInfo?.user?.region_iso ??
          store.getState()?.user?.userInfo?.country_iso ??
          'PK',
      },
    });
  }

  // Now you can write your own methods easily
  // login (username, password) {
  //   // Returns a Promise with the response.
  //   return this.POST('/auth', { username, password });
  // }
  getCurrentUser() {
    // If the request is successful, you can return the expected object
    // instead of the whole response.
    return this.GET('/auth').then(response => response.user);
  }

  get(url) {
    return instanceV2.get(url).then(response => response.data);
  }

  getV2(url) {
    return instanceV4.get(url).then(response => response.data);
  }
  getV3(url) {
    return instanceV3.get(url).then(response => response.data);
  }
  getUat(url) {
    return instanceUat.get(url).then(response => response.data);
  }

  putJson(url, parms) {
    return instanceV2.put(url, parms).then(response => response.data);
  }
  postV2(url, parms) {
    return instanceV8
      .post(url, parms)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return {isError: true, error: err};
      });
  }
  postJson(url, parms) {
    return instanceV2
      .post(url, parms)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
  postJsonRefer(url, parms) {
    return instanceV2.post(url, parms).then(response => {
      return response.data;
    });
    // .catch(err=> {
    //     console.log(err)
    //    return  err
    // })
  }

  postJson2(url, parms) {
    return instanceV2.post(url, parms).then(response => {
      return response;
    });
  }

  // putJson(url, parms) {
  //     return instanceV2.put(url, parms)
  //         .then(response => response.data);
  // }
  getBusesList(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getWheelData(url, params) {
    let form = new FormData();

    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response);
  }

  submitCompaint(url, params) {
    return instanceV2.post(url, params).then(response => response.data);
  }

  replyMsg(url, params) {
    return instanceV2.put(url, params).then(response => response.data);
  }

  getAirlineBookingRequestForm(url, params) {
    // params.
    let form = new FormData();

    for (let key in params) {
      Array.isArray(params[key])
        ? params[key].forEach(value => form.append(key + '[]', value))
        : form.append(key, params[key]);
    }
    // return instance.post(url, form).then(response => response.data);
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getBusTimings(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance.post('', form, {params: {[url]: url}});
  }

  getPaymentMethods(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  busSeatInfo(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getBusServices(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  submitFeedback(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  fromCities(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  toCities(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  encryptRequest(loginUrl, params) {
    let form = new FormData();
    form.append('payload', params);
    form.append('api_key', globals.API_KEY);
    return instance
      .post('', form, {params: {[loginUrl]: loginUrl}})
      .then(response => response.data);
  }

  saveBussOrder(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  login(loginUrl, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[loginUrl]: loginUrl}})
      .then(response => response.data);
  }

  registration(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getOrderDetails(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getNowShowingMoviesList(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getMovieDetail(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  cinemaSeatPlan(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data)
      .catch(error => error);
  }

  upcomingAndBanners(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getCinemasList(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getFlexiFare(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  cinemaSeatReservation(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  cinemaSeatBooking(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  resetPwd(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  changePwd(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getCinemaOrderDetails(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getBusesOrderDetails(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getEventsOrderDetails(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  promoValidation(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  updateDashboard(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  loginFb(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  updatePhoneNum(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  updateProfile(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  updatePassword(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getPackages(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getBadges(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  redeePoints(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response.data);
  }

  getTodayDeals(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }
    return instance
      .post('', form, {params: {[url]: url}})
      .then(response => response);
  }

  hotelApi(url, params) {
    let form = new FormData();
    for (let key in params) {
      Array.isArray(params[key])
        ? params[key].forEach(value => form.append(key + '[]', value))
        : form.append(key, params[key]);
    }
    return instanceV4.post(url, form).then(response => response.data);
  }

  hotelApi3(url, params) {
    let form = new FormData();
    for (let key in params) {
      Array.isArray(params[key])
        ? params[key].forEach(value => form.append(key + '[]', value))
        : form.append(key, params[key]);
    }
    return instanceV4.post(url, form).then(response => response);
  }

  hotelApi2(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }

    return instanceV4.post('', form, {params: {[url]: url}});
  }

  hotelCityApi(url, params) {
    return instanceV4.get(url).then(result => result.data);
  }
  promoApi(url, params) {
    let form = new FormData();
    for (let key in params) {
      Array.isArray(params[key])
        ? params[key].forEach(value => form.append(key + '[]', value))
        : form.append(key, params[key]);
    }
    return instanceV5.post(url, form).then(response => response.data);
  }
  //_retrieveData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('TASKS');
  //     if (value !== null) {
  //       // We have data!!
  //       console.log(value);
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //   }
  // };

  hotelReservationApi = () => {
    try {
      this.hotelCityApi('reservation', params)
        .then(response => {
          // alert(JSON.stringify(response))
        })
        .catch(error => {
          // alert(JSON.stringify(err))
        });
    } catch (error) {
      // alert(JSON.stringify(err))
    }
  };

  updateUser = async () => {
    const login_info = await AsyncStorage.getItem('login_info');
    try {
      if (login_info != null) {
        let values = JSON.parse(login_info);
        let url = 'getUser';
        let params = {
          api_key: globals.API_KEY,
          user_id: values.userId,
        };
        let form = new FormData();
        for (let key in params) {
          form.append(key, params[key]);
        }

        return instance
          .post('', form, {params: {[url]: url}})
          .then(response => {
            if (response.data.status.toUpperCase() === 'SUCCESS') {
              values.points = response.data.user.points;
              values.credits = response.data.user.credits;
              values.offers = response.data.offers;
              values.daily_point_day = response.data.user.daily_point_day;
              values.daily_point_date = response.data.user.daily_point_date;
              values.daily_point_date = response.data.user.daily_point_date;
              values.wheel_offer_date = response.data.user.wheel_offer_date;
              values.api_token = response.data.user.api_token;
              values.hidden_coins = JSON.parse(response.data.user.hidden_coins);

              AsyncStorage.setItem('login_info', JSON.stringify(values)).then(
                value => {
                  // EventRegister.emit('updateUser', 'it works!!!')
                },
              );
            } else {
            }
          });
      }
    } catch (e) {
      // alert(e)
    }
  };

  sendFile(url, params) {
    let form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }

    console.log(JSON.stringify(form));
    return instanceV3.post(url, form).then(response => response.data);
  }
}
