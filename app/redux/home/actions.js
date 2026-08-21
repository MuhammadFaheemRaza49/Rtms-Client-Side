import * as types from './types'

export const saveDashboardInfo = (data) => ({
  type: types.SET_DASHBOARD_DATA,
  payload: data
})


export const saveDiscountsAndCampaigns = (data) => ({
  type: types.SAVE_DISCOUNT_CAMPAIGNS,
  payload: data
})

export const saveVotingData = (data) => ({
  type: types.SAVE_VOTING_DATA,
  payload: data
})

export const saveHomeData = (data) => ({
  type: types.HOME_ICONS,
  payload: data
})

export const saveSessionKey = (key) => ({
  type: types.SESSION_KEY,
  payload: key
})

export const saveLocation = (obj) => ({
  type: types.LOCATION_DATA,
  payload: obj
})

export const savePushbannerTimeStamp = (data) => ({
  type: types.SAVE_TIME_STAMP_PUSHBANNER,
  payload: data
})

export const saveVoucherSettings = (data) => ({
  type: types.SAVE_VOUCHER_SETTING,
  payload: data
})

export const onPending = (data) => ({
  type: types.ONPENDIG,
  payload: data
})


export const updateApp = () => ({
  type: types.UPDATE_APP
})
export const isLoading = (value) => ({
  type: types.IS_LOADING,
  payload: value
})

export const onFailure = (msg) => ({
  type: types.ONFAILURE,
  payload: {
    error: msg
  }
})

export const saveLogicticCities = (data) => ({
  type: types.SAVE_LOGISTIC_CITIES,
  payload: data
})
export const saveExperienceCity = (data) => ({
  type: types.SAVE_EXPERIENCE_CITY,
  payload: data
})

export const saveShowCaseData = (data) => ({
  type: types.SAVE_SHOWCASE,
  payload: data
})



export const saveHotelCities = (data) => ({
  type: types.SAVE_HOTEL_CITY,
  payload: data
})

export const saveBusCities = (data) => ({
  type: types.SAVE_BUS_CITIES,
  payload: data
})

export const saveBusServices = (data) => ({
  type: types.SAVE_BUS_SERVICES,
  payload: data
})

export const savePaymentMethods = (data) => ({
  type: types.SAVE_PAYMENT_METHODS,
  payload: data
})

export const saveMovies = (data) => ({
  type: types.SAVE_MOVIES,
  payload: data
})

export const saveEvents = (data, currentTime) => ({
  type: types.SAVE_EVENTS,
  payload: { data, currentTime }
})

export const saveVoucher = (data) => ({
  type: types.SAVE_VOUCHER,
  payload: data
})
export const resetTimeStamp = () => ({
  type: types.RESET_TIME_STAMP,
})

export const updateStory = (data) => ({
  type: types.UPDATE_STORY,
  payload: data
})

export const saveUserTier = (data) => ({
  type: types.SAVE_USER_TIER,
  payload: data
})
