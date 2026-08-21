import * as types from './types'

const initialState = {
  finishIntro: false,
  enableNotification: false,
  isInfoDialogShowed:false,
  isFirstLogin:true,
  fcmToken: '',
  refer_user_id: '',
  appSessionCount:1,
  permissionInterval:2,
  updationDetail:null,
  isShowUpdateDialog:false,
  user_type:'',
  currency:{"icon": "https://bookmepk.s3.eu-central-1.amazonaws.com/static/custom/V2/currencies/pkr.png", "key": "PKR", "name": "Pakistani Rupree", "rate": 1, "symbol": "Rs."},
  language: "en",
  isOpenSidemenu: false,
  otpMethods:[],
  netInfoConnected: true,
  toast: {
    list: []
  },
  notification: {
    list: []
  },
  appLanguage:'en',
  notificationList: [],
  msgCount: 0,
  airpotCities: [],
  rate_done: false,
  dialogObj: undefined,
  isPointsClaim: false,
  deviceInfo: '',
  bannerCount: 0,
  /* light theme is true and dark theme is false */
  theme: 'light',
  languagee:{
         lang: 'en', rtl: false
  },
  problemList:[]
}

/*
* shareModal
*
* */

export default (state = initialState, action) => {
  const { type, payload, error, meta } = action
  switch (type) {
    case types.FINISH_INTRO: {
      return {
        ...state,
        finishIntro: true
      }
    }
    case types.BANNER_COUNT: {
      return {
        ...state,
        bannerCount: payload
      }
    }
    case types.NOTIFICATION_ENABLE: {
      return {
        ...state,
        enableNotification: true
      }
    }

    case types.IS_FIRST_LOGIN: {
      return {
        ...state,
        isFirstLogin: false
      }
    }
    case types.APP_SESSION_COUNT: {
      return {
        ...state,
        appSessionCount: payload
      }
    }
    case types.PERMISSION_INTERVAL: {
      return {
        ...state,
        permissionInterval: payload
      }
    }
    case types.SAVE_DEVICE_INFO: {
      return {
        ...state,
        deviceInfo: payload
      }
    }
    case types.SAVE_OTP_METHODS: {
      return {
        ...state,
        otpMethods: payload
      }
    }

    case types.UPDATION_DETAIL: {
      return {
        ...state,
        updationDetail: payload
      }
    }
    case types.CHANGE_THEME: {
      return {
        ...state,
        theme: payload
      }
    }
    case types.CHANGE_CURRENCEY: {

      return {
        ...state,
        currency: payload
      }
    }

    case types.NOTIFICATION_DISABLE: {
      return {
        ...state,
        enableNotification: false
      }
    }

    case types.PROBLEMS_LIST: {
      return {
        ...state,
        problemList: payload
      }
    }

    case types.NOTIFICATION_TOGGLE: {
      return {
        ...state,
        enableNotification: payload.value
      }
    }

    case types.SAVE_AIRLINE_INFO_DIALOG: {
      return {
        ...state,
        isInfoDialogShowed: payload
      }
    }

    case types.SAVE_PUSH_NOTIFICATION: {
      return {
        ...state,
        notificationList: payload.notification,
        msgCount: payload.msgCount
      }
    }
    case types.SAVE_FCM_TOKEN: {
      return {
        ...state,
        fcmToken: payload
      }
    }
    case types.PN_COUNT: {
      return {
        ...state,
        msgCount: payload
      }
    }
    case types.ADD_REFER_ID: {
      return {
        ...state,
        refer_user_id: payload
      }
    }
    case types.ADD_USER_TYPE: {
      return {
        ...state,
        user_type: payload
      }
    }
    case types.APP_UPDATE_DIALOG_SHOW: {
      return {
        ...state,
        isShowUpdateDialog: payload
      }
    }
    case types.SAVE_AIRPOTS_CITIES: {
      return {
        ...state,
        airpotCities: payload,
        isFetching: false,
        error: error
      }
    }
    case types.RATING_DONE: {
      return {
        ...state,
        rate_done: true
      }
    }
    case types.START_FETCHING: {
      return {
        ...state,
        isPointsClaim: true
      }
    }
    case types.STOP_FETCHING: {
      return {
        ...state,
        isPointsClaim: false
      }
    }
    case types.DIALOG_OPENING: {
      return Object.assign({}, {
        ...state,
        dialogObj: payload
      })
    }

    case types.DIALOG_CLOSING: {
      return {
        ...state,
        dialogObj: undefined
      }
    }
    case types.LANGUAGE_CHANGE: {
      return {
        ...state,
        languagee: payload
      }
    }

    case types.RTL_CHANGE: {
      return {
        ...state,
        ...payload.value

      }
    }

    /**
         * sidemenu
         */
    case types.SIDEMENU_OPEN: {
      return {
        ...state,
        isOpenSidemenu: true
      }
    }

    case types.SIDEMENU_CLOSE: {
      return {
        ...state,
        isOpenSidemenu: false
      }
    }

    case types.SIDEMENU_TOGGLE: {
      if (!payload || (payload && typeof payload.isOpen === 'undefined')) {
        return {
          ...state,
          isOpenSidemenu: !state.isOpenSidemenu
        }
      }
      return {
        ...state,
        isOpenSidemenu: payload.isOpen
      }
    }

    case types.UPDATE_CONNECTION_STATUS: {
      return {
        ...state,
        netInfoConnected: payload.netInfoConnected
      }
    }

    case types.ADD_TOAST: {
      // rehydrated legacy state may carry a toast slice without a list
      const list = state.toast?.list ?? []
      return {
        ...state,
        toast: {
          list: list.some((toast) => toast.msg === payload.msg)
            ? list
            : [payload, ...list]
        }
      }
    }
    case types.REMOVE_TOAST: {
      const list = state.toast?.list ?? []
      if (!list.some((msg) => msg.key === payload.key)) {
        return state
      }
      return {
        ...state,
        toast: {
          list: list.filter((msg) => msg.key !== payload.key)
        }
      }
    }

    case types.ADD_NOTIFICATION: {
      return {
        ...state,
        notification: {
          list: state.notification.list.some((toast) => toast.msg === payload.msg)
            ? state.notification.list
            : [payload, ...state.notification.list]
        }
      }
    }
    case types.REMOVE_NOTIFCATION: {
      return {
        ...state,
        notification: {
          list: state.notification.list.filter((msg) => msg.key !== payload.key)
        }
      }
    }
    default:
      return state
  }
}
