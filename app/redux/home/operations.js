import * as actions from './actions';
import {resetTimeStamp, saveDashboardInfo} from './actions';
import RestApi from '../../services/restclient/RestApi';
import {toast} from '../../Omni';
import * as globals from '../../../globals';
import YourRestApi from '../../container/SearchRestaurant/shared/restclient/YourRestApi';
import store from "../../store/configureStore";
import {logout} from "../user/operations";
import Dashboard from "../../container/SearchRestaurant/shared/HomeContainer/Dashboard";
import {openDialog, saveFirstSignup} from "../app/actions";
import {apiError} from '../../container/SearchRestaurant/shared/Permissions/Helper/HelperFuncations';
import AppConstant from "../../common/AppConstant";


export const updateDashbordApi = (data) => (dispatch) => {
    try {

        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().get('users/profile/dashboard', {
            params: data,
            headers: {
                'Authorization': globals.AUTH_TOKEN
            }
        }).then((json) => {
            console.log('json.data',json.data);
            let dashboard = new Dashboard(json.data);
            dispatch(saveDashboardInfo(dashboard));
            return dashboard;
        }).catch((err) => {
          console.log("err",err);
            if (err?.response?.status === 401) {

                store.dispatch(logout())
                store.dispatch(resetTimeStamp())
            }
            if (err?.response?.status === 403) {
                return {isBlocked: true};
            }
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};


export const getBookmeTiers = (params) => (dispatch) => {
  try {
    return RestApi.getJSInstance().get('tiers', {
      params: params,
      headers: {
        'Authorization': globals.AUTH_TOKEN
      }
    }).then((json) => {
      const {data} = json;
      if(data?.Status?.Code == 200) {
       return data
      }
      return null
    }).catch((err) => {
      apiError(err)
      return undefined;
    })
  }catch (error) {
    return undefined;
  }
}


export const getUserTier = (params) => (dispatch) => {
    try {
        return RestApi.getJSInstance().get('user/tier', {
            params: params,
        }).then((json) => {
            const {data} = json;
            if(data?.Status?.Code == 200&&data?.Data) {
                dispatch(actions.saveUserTier(data?.Data));
                return data?.Data
            }
            return null
        }).catch((err) => {
            return undefined;
        })
    }catch (error) {
        return undefined;
    }
}

export const getNewHomeData = (params) => (dispatch) => {


  console.log("paramsNewHome",params);
    try {
        dispatch(actions.onPending());
        return RestApi.getJSInstance().get('user/dashboard/all', {
            params: params,
        }).then((json) => {

            const {data} = json
            const {Data} = data;

            dispatch(actions.saveHomeData(Data))
            return Data;
        }).catch((err) => {


          console.log(err);
            apiError(err)
            dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const getRegionList = (params) => (dispatch) => {

  try {
    dispatch(actions.onPending());
    return RestApi.getJSInstance().get('user/regions', {
      params: params,
    }).then((json) => {

      const {data} = json
      const {Data} = data;

      return Data;
    }).catch((err) => {


      apiError(err)
      dispatch(actions.onFailure(err));
      return undefined;
    });
  } catch (error) {
    // dispatch(actions.onFailure(error));
    return undefined;
  }
};

export const checkUserRegion = (params) => (dispatch) => {

  try {
    dispatch(actions.onPending());
    return RestApi.getJSInstance().post('user/regions/check', params).then((json) => {

      const {data} = json
      const {Data} = data;

      return Data;
    }).catch((err) => {


      apiError(err)
      dispatch(actions.onFailure(err));
      return undefined;
    });
  } catch (error) {
    // dispatch(actions.onFailure(error));
    return undefined;
  }
};

export const updateUserRegion = (params) => (dispatch) => {

  try {
    dispatch(actions.onPending());
    return RestApi.getJSInstance().post('/user/regions/update',params).then((json) => {

      const {data} = json
      if (data?.Status?.Code===200){
        return true;
      }
    }).catch((err) => {


      apiError(err)
      dispatch(actions.onFailure(err));
      return undefined;
    });
  } catch (error) {
    // dispatch(actions.onFailure(error));
    return undefined;
  }
};




export const getDashboardRecommendation = (params) => (dispatch) => {
    try {
        dispatch(actions.onPending());
        return RestApi.getJSInstance().get('generic-recommendation/all', {
            params: params,
        }).then((json) => {
            const {data} = json

            return data;
        }).catch((err) => {


            apiError(err)
            dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};


export const getAdsAPI = (params) => (dispatch) => {
    try {
        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().post('ads/list', params).then((json) => {
            const {data} = json
            return data;
        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const getVotingData = (params) => (dispatch) => {
    try {
        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().post('users/votings/index', params).then((json) => {
            const {data} = json
            dispatch(actions.saveVotingData(data[0]))
            return data;
        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const submitVoteApi = (params) => (dispatch) => {
    try {
        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().post('users/votings/index', params).then((json) => {
            const {data} = json
            return data;
        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};



export const getUserLocationThroughIP = (token) => (dispatch) => {
    try {
        return RestApi.getAirlineInstance().get('api/user-location', {
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then((json) => {
            const {data} = json
            dispatch(actions.saveLocation({
                city:data.CityName,
                latitude:data.Lat,
                longitude:data.Lon,
                iso:data.Country?.alpha_2,
                country:data.Country?.name,
            }))
            return data;
        }).catch((err) => {
            apiError(err,false)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};


export const getUserLocationThroughLatLng = (token,params) => (dispatch) => {
    try {
        return RestApi.getAirlineInstance()
          .get('api/user-location', {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(json => {
            const {data} = json;
            let obj = {
              city: data.CityName,
              latitude: data.Lat,
              longitude: data.Lon,
              iso: data.Country?.alpha_2,
              country: data.Country?.name,
            };
            return obj;
          })
          .catch(err => {
            apiError(err, false);
            return undefined;
          });
    } catch (error) {
        return undefined;
    }
};



export const getAllbooking = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().post('/user/bookings/all', params).then((json) => {
            const {data} = json

            if (data.data && data.data?.length > 0) {
                return data;
            } else {
                return undefined
            }

        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};
export const getUpcomingTrips = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().post('/user/bookings/upcoming', params).then((json) => {
            const {data} = json

            if (data?.data && data?.data?.length > 0) {
                return data;
            } else {
                return undefined
            }

        }).catch((err) => {
            console.log('err', err)

            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const getBookingDetail = (params) => (dispatch) => {
    try {


        return RestApi.getJSInstance().post('/user/bookings/get', params).then((json) => {
            const {data} = json

            if (data.Data) {
                return data.Data;
            } else {
                return undefined
            }

        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const getDiscountsAndCampaigns = (params, isSave) => (dispatch) => {
    try {
        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().post('vouchers/list', params).then((json) => {

            const {data} = json
            if (isSave){
                if (data && data.length>0){
                    dispatch(actions.saveDiscountsAndCampaigns(data))
                }else {
                    dispatch(saveFirstSignup())
                }

            }



            return data

        }).catch((err) => {


            console.log(JSON.stringify(err))
            apiError(err,false)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};

export const getVoucherSettings = (params) => (dispatch) => {

    try {
        // dispatch(actions.onPending());
        return RestApi.getInstanceV2().post('settings/index', params).then((json) => {
            const {data} = json
            dispatch(actions.saveVoucherSettings(data))
            return data

        }).catch((err) => {


            apiError(err)
            // dispatch(actions.onFailure(err));
            return undefined;
        });
    } catch (error) {
        // dispatch(actions.onFailure(error));
        return undefined;
    }
};


export const getVerticalVouchers = (params) => (dispatch) => {
    try {

        return RestApi.getInstanceV2().post('vouchers/list', params).then((json) => {
            const {data} = json
            return data

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};
export const getLeaderBoardData = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().get('user/leaderboard', {
          params:params,
        }).then((json) => {
            const {data} = json
            return data?.Data

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};


export const getFaqs = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance()
          .get('static-data', {
            params: params,
          })
          .then(json => {
            const {data} = json;
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


export const getLeaderboardInfo = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().get('user/leaderboard/get-info', {
          params:params,
        }).then((json) => {
            const {data} = json
            return data?.Data

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};

export const getLeaderboardBookingInfo = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().get('user/tier-leaderboard', {
          params:params,
        }).then((json) => {
            const {data} = json
            return data?.Data

        }).catch((err) => {
            console.log("LEASEWREE",JSON.stringify(err));
            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};


export const claimCashBack = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().post('user/cashback/claim', params).then((json) => {
            const {data} = json
            if(data?.Status?.Code == 200){
                return data?.Data;
            }
            return null
        }).catch((err) => {
            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};

export const generatePDFTicket = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().post('user/bookings/pdf/generate-pdf', params).then((json) => {
            const {data} = json
            return data?.data

        }).catch((err) => {
            console.log("LEASEWREE",JSON.stringify(err));
            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};

export const getTotalPointsAPI = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().get('user/leaderboard/total-referral-points', {
          params:params,
        }).then((json) => {
            const {data} = json
            return data?.Data

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};

export const getInviteesList = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().get('user/invitations', {
          params:params,
        }).then((json) => {
            const {data} = json
            return data?.Data

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};


export const sendInvitationAPI = (params) => (dispatch) => {
    try {

        return RestApi.getJSInstance().post('user/invitations',params,{

        }).then((json) => {
            const {data} = json

            if (data?.Status?.Code===200){
              toast(data?.Status?.Description)
              return true
            }

        }).catch((err) => {


            apiError(err)
            return undefined;
        });
    } catch (error) {
        return undefined;
    }
};



export const downloadService = () => (dispatch) => {
    dispatch(downloadBussCities());

};

export const getServiceData = (moveFurther = true) => (dispatch) => {

    let url = 'getBusData';
    let params = {
        api_key: globals.API_KEY,
        service_id: AppConstant.service_id,
        all_service:0
    };

    console.log(params)
    return RestApi.formatData(url, params)
        .then(response => {
            if (response){
                console.log("serviceData=>",response)
                if(Array.isArray(response)){
                    store.dispatch(openDialog({serviceErrorDialog: true}));
                    return {success: false, error: 'Invalid service response'};
                }
                dispatch(actions.saveBusServices(response))
                if (response.departure) {
                    dispatch(actions.saveBusCities(response.departure));
                }
            }
            return { success: true, data: response };
        })
        .catch(err => {
            return { success: false, error: err.message };
        });
};

export const downloadBussCities = (moveFurther = true) => (dispatch) => {
    try {

        let params = {
            api_key: globals.API_KEY,
            service_id: globals.BUS_SERVICE_ID,
            all_service: 0,
        }
        console.log('bus city params',params);
        return RestApi.getInstanceV2().get(`buses/cities`, {
          params: params,
        }).then(response => {
            if (response.data) {
                console.log('bus cities', response.data)



              dispatch(actions.saveBusCities(response.data))
              if (moveFurther)
                dispatch(downloadBusServices());
              return response.data;
            } else {
                return undefined
            }

        })
            .catch(err => {
                console.log("err", err)
                return true
            });
    } catch (e) {
        return true
    }
};

export const downloadBusServices = (moveFurther = true) => (dispatch) => {
    try {
        let params = {
            api_key: globals.API_KEY,
            service_id: globals.BUS_SERVICE_ID,
            all_service: 0,
        };
        return RestApi.getInstanceV0().post('', params, {
            params: {
                getBusData: ''
            }
        })
            .then(response => {
                console.log('bus services', response.data)
                if (response.data) {
                  dispatch(actions.saveBusServices(response.data))
                  return response.data;

                } else {
                    return undefined
                }
            })
            .catch(err => {
                return true
            });
    } catch (e) {
        return true
    }
};

function databaseError(error) {
    console.log("DATABASE ERROR", error.toString())
}


export const getVoucher = (token) => (dispatch) => {
    try {
        dispatch(actions.onPending(true))
        const url = `reward/getOffers?api_key=${globals.API_KEY}&api_token=${token}`;
        let restApi = new YourRestApi();
        return restApi.get(url).then(response => {
            dispatch(actions.onPending(false))
            return response;
        }).catch(err => {
            dispatch(actions.onPending(false))
            return undefined;
        });
    } catch (e) {
        dispatch(actions.onPending(false))
        return undefined;
    }
};
export const claimVoucher = (api_token, reward_id) => (dispatch) => {
    try {
        const url = `reward/redeem`;
        const params = {
            api_token: api_token,
            api_key: globals.API_KEY,
            reward_id: reward_id,
        };
        let restApi = new YourRestApi();
        return restApi.submitCompaint(url, params).then(response => {
            return response;
        }).catch(err => {
            return undefined;
        });
    } catch (e) {
        return undefined;
    }
};
export const redeemVoucher = (params) => (dispatch) => {
    try {
        const url = `vouchers/redeem`;
        return RestApi.getInstanceV2().post(url, params).then(response => {
            const {data} = response
            if (data) {
                return data
            } else
                return undefined;
        }).catch(err => {
            apiError(err)
            return undefined;
        });
    } catch (e) {
        return undefined;
    }
};


//Experience Api implement

export const experienceList = (city_id, date) => (dispatch) => {
    try {
        let url = `citywise-experiences?api_key=${globals.API_KEY}&city_id=${city_id}&exp_date=${date}`;
        let restApi = new YourRestApi();
        dispatch(actions.isLoading(true));
        return restApi.getV2(url).then(response => {
            dispatch(actions.isLoading(false));
            if (response.status) {
                return response.data;
            } else {
                toast(response.message);
                return undefined;
            }

        }).catch(err => {
            toast(err?.response?.data?.message);
            dispatch(actions.isLoading(false));
            return undefined;
        });
    } catch (e) {

    }
};

export const reserveExperience = (params) => (dispatch) => {
    try {
        const api = new YourRestApi();
        return api.hotelApi('experience-reservation', params).then(response => {
            dispatch(actions.isLoading(false));
            if (response.status) {
                return response.data;
            } else {
                toast(response.message);
                return undefined;
            }

        }).catch(err => {
            toast(err?.response?.data?.message);
            dispatch(actions.isLoading(false));
            return undefined;
        });
    } catch (e) {

    }
};
export const commentExperience = (params) => (dispatch) => {
    try {
        const api = new YourRestApi();
        return api.hotelApi('post-comment', params).then(response => {
            if (response.status) {
                return response;
            } else {
                toast(response.message);
                return undefined;
            }

        }).catch(err => {
            toast(err?.response?.data?.message);
            return undefined;
        });
    } catch (e) {

    }
};
export const cancelOrderExperience = (referId) => (dispatch) => {
    try {
        let url = `cancel-experience?api_key=${globals.API_KEY}&order_ref_id=${referId}`;
        let restApi = new YourRestApi();
        return restApi.getV2(url).then(response => {
            if (response.status) {
                toast(response?.message);
                return response.data;
            } else {
                toast(response.message);
                return undefined;
            }


        }).catch(err => {
            toast(err?.response?.data?.message);
            return undefined;
        });
    } catch (e) {
    }
};

export const getFillterTransactions = (api_token) => (dispatch) => {
    try {
        let url = `transaction-history/filters?api_key=${globals.API_KEY}&api_token=${api_token}`;
        let restApi = new YourRestApi();
        return restApi.getV3(url).then(response => {
            return response;
        }).catch(err => {

            apiError(err)
            return undefined;
        });
    } catch (e) {

    }
};

export const getTransections = (filterData, api_token, nextUrl) => (dispatch) => {
    try {
        let form = {
            api_key: globals.API_KEY,
            api_token: api_token
        };
        if (filterData) {
            let filterObject = {};
            for (let object of filterData) {
                filterObject[object.slug] = object.filters.filter(item => item.selected).map((item) => item.key);
            }

            form.filters = filterObject;
        }
        console.log(form)
        let url = `transaction-history/index${nextUrl ? nextUrl : ''}`;
        let restApi = new YourRestApi();
        return restApi.postV2(url, JSON.stringify(form)).then(response => {
            if (response.isError){
                apiError(response.error)
                return undefined;
            }else {
                return response;
            }

        }).catch(err => {
            console.log(err)
            toast(err?.response?.data?.message);
            return undefined;
        });
    } catch (e) {
        console.log(e)
        return undefined
    }
};

export const getFeebackQuestions = (params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().get(`feedback/questions`, {
            params: params,
        }).then(response => {
          console.log("response",response);
            const {data} = response
            if (response.status === 200) {
                return data
            } else if (response.status === 202){
              return {data,alreadySubmitted:true}
            }else
                return undefined;
        }).catch(err => {
            apiError(err)
            return undefined;
        });
    } catch (e) {
        return undefined;
    }
};


export const submitFeedbackForm = (params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().post(`feedback/submit`,params).then(response => {
            const {data} = response
            if (data) {
                return data
            } else
                return undefined;
        }).catch(err => {
            apiError(err)
            return undefined;
        });
    } catch (e) {
        return undefined;
    }
};
