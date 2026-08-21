import * as types from './types'
import { useSelector } from 'react-redux'
import {SAVE_AIRLINE_INFO_DIALOG} from './types';

/**
 * initial app
 */
export const beginInitApp = () => ({
  type: types.INITIAL_APP
})

/**
 * intro screen
 */
export const finishIntro = () => ({
  type: types.FINISH_INTRO
})
export const saveAirpotCities = (data) => ({
  type: types.SAVE_AIRPOTS_CITIES,
  payload: data
})
export const savePushNotification = (obj) => ({
  type: types.SAVE_PUSH_NOTIFICATION,
  payload: obj
})
export const saveOTPMethods = (obj) => ({
  type: types.SAVE_OTP_METHODS,
  payload: obj
})

export const updateAppPreviousLanguage = (obj) => ({
  type: types.UPDATE_PREVIOUS_LANGUAGE,
  payload: obj
})

export const saveAirlineInfoDialogShowed = () => ({
  type: types.SAVE_AIRLINE_INFO_DIALOG,
  payload: true
})

export const saveAppSessionCount = (count) => ({
  type: types.APP_SESSION_COUNT,
  payload: count
})
export const savePermissionInterval = (count) => ({
  type: types.PERMISSION_INTERVAL,
  payload: count
})
export const saveFirstSignup = () => ({
  type: types.IS_FIRST_LOGIN,
})

export const saveDeviceInfo = (deviceInfo) => ({
  type: types.SAVE_DEVICE_INFO,
  payload: deviceInfo
})


export const saveProblemList = (list) => ({
  type: types.PROBLEMS_LIST,
  payload: list
})

export const saveFcmToken = (token) => ({
  type: types.SAVE_FCM_TOKEN,
  payload: token
})
export const savePNCount = (count) => {
  return {
    type: types.PN_COUNT,
    payload: count
  }
}
export const setBannerCount = (count) => {
  return {
    type: types.BANNER_COUNT,
    payload: count
  }
}

export const ratingDone = () => {
  return {
    type: types.RATING_DONE
  }
}

export const addReferId = (id) => {
  return {
    type: types.ADD_REFER_ID,
    payload: id
  }
}

export const addUserType = (id) => {
  return {
    type: types.ADD_USER_TYPE,
    payload: id
  }
}

/**
 * notification
 */
export const enableNotification = () => ({
  type: types.NOTIFICATION_ENABLE
})

export const disableNotification = () => ({
  type: types.NOTIFICATION_DISABLE
})

export const toggleNotification = (value) => ({
  type: types.NOTIFICATION_TOGGLE,
  payload: {
    value
  }
})

/**
 * currency
 */
export const changeCurrency = (value) => ({
  type: types.CHANGE_CURRENCEY,
  payload: value
})

/**
 * language
 */
export const changeLanguage = (value) => ({
  type: types.LANGUAGE_CHANGE,
  payload: value
})



export const changeTheme = (value) => ({
  type: types.CHANGE_THEME,
  payload: value
})
export const openDialog = (obj) => ({
  type: types.DIALOG_OPENING,
  payload: obj
})

export const startPointClaim = () => ({
  type: types.START_FETCHING
})
export const stopPointClaim = () => ({
  type: types.STOP_FETCHING
})

export const closeDialog = () => ({
  type: types.DIALOG_CLOSING
})


export const updateDialogShowAction = (value) => ({
  type: types.APP_UPDATE_DIALOG_SHOW,
  payload:value
})

export const saveUpdationDetail = (value) => ({
  type: types.UPDATION_DETAIL,
  payload:value
})

/**
 * sidemenu
 */

export const openSidemenu = () => ({
  type: types.SIDEMENU_OPEN
})

export const closeSidemenu = () => ({
  type: types.SIDEMENU_CLOSE
})

export const toggleSidemenu = (isOpen) => ({
  type: types.SIDEMENU_TOGGLE,
  payload: {
    isOpen
  }
})

/**
 * netinfo
 */
export const updateConnectionStatus = (netInfoConnected) => ({
  type: types.UPDATE_CONNECTION_STATUS,
  payload: {
    netInfoConnected
  }
})

/**
 * toast
 */
export const addToast = (msg, key) => ({
  type: types.ADD_TOAST,
  payload: {
    msg,
    key
  }
})

export const removeToast = (key) => ({
  type: types.REMOVE_TOAST,
  payload: {
    key
  }
})

export const addNotification = (msg,type, key) => ({
  type: types.ADD_NOTIFICATION,
  payload: {
    msg,
    type,
    key
  }
})

export const removeNotification = (key) => ({
  type: types.REMOVE_NOTIFCATION,
  payload: {
    key
  }
})
