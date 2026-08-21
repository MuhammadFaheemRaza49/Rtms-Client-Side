import * as types from './types'
import moment from 'moment'
// import globals from '../../../globals'

const initialState = {
  dashboardInfo: null,
  lastUpdateApis: null,
  appVersion: null,
  pushBannerTimeStamp: null,
  isFetching: false,
  discountCampaigns: [],
  showcase: null,
  error: null,
  voucherSetting: null,
  updateApp: false,
  session_key: "",
  paymentMethods: [],
  location: null,
  homeData: null,
  moviesList: [],
  voucherList: [],
  votingData: null,
  updateStory: 0,
  user_tier: null,

}

export default (state = initialState, action) => {
  const { type, payload, error } = action

  switch (type) {
    case types.ONFAILURE: {
      return {
        ...state,
        isFetching: false,
        error: payload?.error,
      }
    }
    case types.SET_DASHBOARD_DATA: {
      return {
        ...state,
        dashboardInfo: { ...payload },
        isFetching: false,
        error: null
      }
    }

    case types.ONPENDIG: {
      return {
        ...state,
        isFetching: payload,
        error: null
      }
    }
    case types.UPDATE_STORY: {
      return {
        ...state,
        updateStory: payload,
      }
    }
    case types.LOCATION_DATA: {
      return {
        ...state,
        location: payload,
      }
    }
    case types.IS_LOADING: {
      return {
        ...state,
        isFetching: payload,
        error: null
      }
    }

    case types.ONSUCCESS: {
      return {
        ...state,
        isFetching: false
      }
    }

    case types.ONFAILURE: {
      return {
        ...state,
        isFetching: false,
        error: error
      }
    }

    case types.SAVE_LOGISTIC_CITIES: {
      return {
        ...state,
        logisticCities: payload,
        isFetching: false,
        error: error
      }
    }

    case types.SAVE_TIME_STAMP_PUSHBANNER: {
      return {
        ...state,
        pushBannerTimeStamp: payload,
        isFetching: false,
        error: error
      }
    }
    case types.HOME_ICONS: {
      return {
        ...state,
        homeData: payload,
        isFetching: false,
        error: null
      }
    }


    case types.SAVE_DISCOUNT_CAMPAIGNS: {
      return {
        ...state,
        discountCampaigns: payload,
        isFetching: false,
        error: error
      }
    }

    case types.SESSION_KEY: {
      return {
        ...state,
        session_key: payload,
      }
    }

    case types.SAVE_SHOWCASE: {
      return {
        ...state,
        showcase: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_VOUCHER_SETTING: {
      return {
        ...state,
        voucherSetting: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_EXPERIENCE_CITY: {
      return {
        ...state,
        experienceCity: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_HOTEL_CITY: {
      return {
        ...state,
        hotelCities: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_BUS_CITIES: {
      return {
        ...state,
        busCities: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_EVENTS: {
      return Object.assign({}, {
        ...state,
        eventList: payload.data,
        lastUpdateApis: moment().unix(),
        appVersion: globals.AppVersion,
        isFetching: false,
        error: error
      })
    }
    case types.RESET_TIME_STAMP: {
      return {
        ...state,
        lastUpdateApis: 0,
      }
    }

    case types.SAVE_BUS_SERVICES: {
      return {
        ...state,
        allServices: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_PAYMENT_METHODS: {
      return {
        ...state,
        paymentMethods: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_MOVIES: {
      return {
        ...state,
        moviesList: payload,
        isFetching: false,
        error: error
      }
    }

    case types.SAVE_VOUCHER: {
      return {
        ...state,
        voucherList: payload,
        isFetching: false,
        error: error
      }
    }
    case types.SAVE_VOTING_DATA: {
      return {
        ...state,
        votingData: payload,
        isFetching: false,
        error: error
      }
    }

    case types.SAVE_USER_TIER: {
      return {
        ...state,
        user_tier: payload,
        isFetching: false,
        error: error
      }
    }

    default:
      return state
  }
}
