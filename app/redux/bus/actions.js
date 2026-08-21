import * as types from './types'

export const saveRecentSearches = (data) => ({
  type: types.BUS_SERVICES_RECENT_SEARCH,
  payload: data,
  error: false
})

export const saveBusSetting = (data) => {
  return ({
    type: types.SAVE_BUS_SETTING,
    payload: data
  })
}
export const setProgressCounter = (data) => {
  return ({
    type: types.PROGRESS_COUNTER,
    payload: data
  })
}
export const saveIsShowBundleSheet = (data) => {
  return ({
    type: types.IS_SHOW_BUNDLE_SHEET,
    payload: data
  })
}
export const saveBusObj = (data) => {
  return ({
    type: types.SAVE_BUS_OBJ,
    payload: data
  })
}
export const saveOutBoundInfo = (data) => ({
  type: types.SAVE_OUTBOUND_OBJ,
  payload: data
})

export const saveInBoundInfo = (data) => ({
  type: types.SAVE_INBOUND_OBJ,
  payload: data
})

export const resetOutBoundInfo = () => ({
  type: types.RESET_OUTBOUND_OBJ
})

export const resetInBoundInfo = () => ({
  type: types.RESET_INBOUND_OBJ
})

export const saveOutBoundSeatPlanInfo = (data) => ({
  type: types.SAVE_OUTBOUND_SEATINFO_DETAIL,
  payload: data
})

export const saveInBoundSeatPlanInfo = (data) => ({
  type: types.SAVE_INBOUND_SEATINFO_DETAIL,
  payload: data
})

export const savePassengerDetail = (data) => ({
  type: types.SAVE_USER_DEATIL,
  payload: data
})

export const changeIsOutBound = (data) => ({
  type: types.CHNAGE_IS_OUTBOUND,
  payload: data
})

export const updateSeatCount = (data) => ({
  type: types.UPDATE_SEAT_COUNT,
  payload: data
})
export const setSelectedSeats = (data) => ({
  type: types.SELECTED_SEATS,
  payload: data
})

export const saveBusTerminalGalllery = (data) => {
  return ({
    type: types.SAVE_BUS_AND_TERMINAL_IMAGES,
    payload: data
  })
}

export const resetAllData = () => ({
  type: types.RESET_ALL_STATE
})
