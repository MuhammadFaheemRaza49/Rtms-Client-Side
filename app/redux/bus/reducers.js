import * as types from './types'
/*
* isOutBound=
* 1 is for outbound
* 2 is for inbound
* 3 is from both selected
* */
const initialState = {
  isFetching: false,
  error: null,
  busSearchServices: [],
  progressCounter:0,
  recentSearches:null,
  recentSearch:null,
  searchObj: undefined,
  outBoudObj: undefined,
  inBoundObj: undefined,
  outBoundSeatInfo: [],
  inBoundSeatInfo: [],
  passengerDetail: {},
  outBoundPrice: {},
  inBoundPrice: {},
  isOutBound: 1,
  seatCont: 0,
  selectedSeats: [],
  busGallery: undefined,
  activeBundles: [],
  busSetting: {},
  isShowBundleInfo: true
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.IS_SHOW_BUNDLE_SHEET: {
      return {
        ...state,
        isShowBundleInfo: payload
      }
    } case types.BUS_FETCHING: {
      return {
        ...state,
        isFetching: true,
        error: null
      }
    }
    case types.SAVE_BUS_SETTING: {
      return {
        ...state,
        busSetting: payload
      }
    }
    case types.BUS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: payload
      }
    }

    case types.BUS_SERVICES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        busSearchServices: payload,
        error: null
      }
    }
    case types.SAVE_BUS_AND_TERMINAL_IMAGES: {
      return {
        ...state,
        busGallery: payload
      }
    }

    case types.BUS_SERVICES_RECENT_SEARCH: {
      return {
        ...state,
        recentSearch: payload,
        error: null
      }
    }
    case types.PROGRESS_COUNTER: {
      return {
        ...state,
        progressCounter: payload,
        error: null
      }
    }
    case types.UPDATE_BUS_OBJ: {
      return {
        ...state,
        busObj: { ...state.busObj, ...payload }
      }
    }
    case types.SAVE_BUS_OBJ: {
      return {
        ...state,
        searchObj: payload
      }
    }
    case types.SAVE_OUTBOUND_OBJ: {
      return {
        ...state,
        outBoudObj: payload,
        isOutBound: payload ? payload.isOutBound : 1
      }
    }
    case types.RESET_OUTBOUND_OBJ: {
      return {
        ...state,
        outBoudObj: undefined,
        isOutBound: 1
      }
    }
    case types.SAVE_INBOUND_OBJ: {
      return {
        ...state,
        inBoundObj: payload,
        isOutBound: payload ? payload.isOutBound : 1
      }
    }
    case types.RESET_INBOUND_OBJ: {
      return {
        ...state,
        inBoundObj: undefined,
        isOutBound: 2
      }
    }
    case types.SAVE_OUTBOUND_SEATINFO_DETAIL: {
      return {
        ...state,
        outBoundSeatInfo: payload.seat,
        outBoundPrice: payload.seatPrice
      }
    }
    case types.SAVE_INBOUND_SEATINFO_DETAIL: {
      return {
        ...state,
        inBoundSeatInfo: payload.seat,
        inBoundPrice: payload.seatPrice
      }
    }

    case types.SAVE_USER_DEATIL: {
      return {
        ...state,
        passengerDetail: payload
      }
    } case types.CHNAGE_IS_OUTBOUND: {
      return {
        ...state,
        isOutBound: payload
      }
    }
    case types.RESET_ALL_STATE: {
      return {
        ...state,
        searchObj: undefined,
        outBoudObj: undefined,
        inBoundObj: undefined,
        outBoundSeatInfo: undefined,
        inBoundSeatInfo: undefined,
        passengerDetail: undefined,
        isOutBound: 1,
        progressCounter:0

      }
    } case types.UPDATE_SEAT_COUNT: {
      return {
        ...state,
        seatCont: payload
      }
    }
    case types.SELECTED_SEATS: {
      return {
        ...state,
        selectedSeats: [...payload]
      }
    }
    default:
      return state
  }
}
