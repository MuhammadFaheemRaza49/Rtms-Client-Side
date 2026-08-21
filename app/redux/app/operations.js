import * as actions from './actions'
import {CommonActions} from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging'
import {I18nManager, Platform} from 'react-native';
import store from './../../store/configureStore'
import * as globals from '../../../globals'
import * as DeviceInfo from 'react-native-device-info'
import RestApi from "../../services/restclient/RestApi";
import {apiError, requestFCMPermission} from "../../container/SearchRestaurant/shared/Permissions/Helper/HelperFuncations";

export const initialApp = () => (dispatch) => {
    dispatch(actions.beginInitApp())
    dispatch(saveDeviceInfo())
}

export const switchLanguage = (language) => (dispatch) => {
    I18nManager.allowRTL(language?.isRtl);
    I18nManager.forceRTL(language?.isRtl);
    dispatch(actions.changeLanguage({lang: language?.lang, rtl: language?.isRtl}))

}

export const saveFCM = () => async (dispatch) => {
    try {
        const hasPermission = await requestFCMPermission();

        if (!hasPermission) {
            console.warn('[FCM] Notification permission not granted');
            return;
        }
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
        }
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
            console.log('[FCM] Token:', fcmToken);

            if (Platform.OS === 'ios') {

                await messaging().subscribeToTopic('ios_app');
            }

            dispatch(actions.saveFcmToken(fcmToken));
        } else {
            console.warn('[FCM] No token received');
        }
    } catch (error) {
        console.error('[FCM] Error saving token:', error);
    }
}

export const saveDeviceInfo = () => async (dispatch) => {
    try {
        const buildNumber = DeviceInfo.getBuildNumber()
        const brand = DeviceInfo.getBrand()
        const deviceId = DeviceInfo.getDeviceId()
        const readableVersion = DeviceInfo.getReadableVersion()
        const systemVersion = DeviceInfo.getSystemVersion()
        const currentVersion = DeviceInfo.getVersion()
        const apiLevel = await DeviceInfo.getApiLevel()
        const totalMemory = await DeviceInfo.getTotalMemory()
        const buildId = await DeviceInfo.getBuildId()
        const device = await DeviceInfo.getDevice()
        const deviceName = await DeviceInfo.getDeviceName()
        const obj = {
            buildNumber,
            brand,
            deviceId,
            readableVersion,
            systemVersion,
            apiLevel,
            totalMemory,
            buildId,
            device,
            deviceName,
            currentVersion
        }
        dispatch(actions.saveDeviceInfo(JSON.stringify(obj)))
    } catch (e) {

    }
}

export const saveNotification = (notification) => (dispatch) => {
    const state = store.getState()
    const {notificationList} = state.app
    notificationList.push(notification)

    const obj = {
        notification: notificationList,
        msgCount: state.app.msgCount + 1
    }
    dispatch(actions.savePushNotification(obj))
}

export const resetNotification = () => (dispatch) => {
    const state = store.getState()
    const {notificationList} = state.app
    const notifyArr = []
    for (const notify of notificationList) {
        const notii = {...notify}
        notii.seen = 1
        notifyArr.push(notii)
    }

    const obj = {
        notification: notifyArr,
        msgCount: 0
    }
    dispatch(actions.savePushNotification(obj))
}


export const getProblemList = () => (dispatch) => {

    try {

        return RestApi.getInstanceV2().get('contactUs/getSuggestions', {
            params: globals.API_KEY
        }).then((response) => {
            const {data} = response
            if (data) {
                dispatch(actions.saveProblemList(data))
                return data;
            }
        }).catch(error => {
            apiError(error, false)

        })


    } catch (e) {

    }


}

export const sendEmailAPI = (params) => (dispatch) => {


    let form = new FormData();
    for (let key in params) {
        form.append(key, params[key]);
    }
    try {
        console.log(form)
        return RestApi.getInstanceV2().post('contactUs/sendMail', form).then((response) => {
            const {data} = response
            // toast(data)
            return data
        }).catch(err => {

            apiError(err)

        })


    } catch (e) {

    }


}

export const submitClaimInsurance = (params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().post('insurance/claim', params).then((response) => {
            const {data} = response
            // toast(data)
            return data
        }).catch(err => {
            apiError(err)

        })


    } catch (e) {

    }


}

export const uploadImages = (params) => (dispatch) => {
    let form = new FormData();
    for (let key in params) {
        if (key === 'file') {
            let index = 0
            for (let img of params[key]) {
                form.append(`files[${index}]`, img);
                ++index
            }
        } else {
            form.append(key, params[key]);
        }
    }

    try {
        console.log("form", form);

        return RestApi.getInstanceV2().post('uploader/index', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': globals.AUTH_TOKEN
            }
        }).then((response) => {
            const {data} = response
            // toast(data)
            return data
        }).catch(err => {
            console.log("Error", JSON.stringify(err));
            apiError(err)
            return undefined
        })
    } catch (e) {

    }
}


export const getBookingStatus = (path) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().get(path).then((response) => {
            const data = response?.data
            // token orders: Order carries parent_order (the original order) — treat it as the order
            if (data?.Order?.parent_order) {
                return {...data, Order: data.Order.parent_order}
            }
            return data
        }).catch(err => {
            apiError(err, false)
            return undefined


        })


    } catch (e) {

    }


}


export const getBankList = (path) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().get(path).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            apiError(err)
            return undefined


        })


    } catch (e) {

    }


}


export const getActiveWithdrawRequest = (path) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().get(path).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            apiError(err)
            return undefined


        })


    } catch (e) {

    }


}

export const getOTPMethods = () => (dispatch) => {
    try {
        return RestApi.getInstanceV2().get("guests/config").then((response) => {
            const {data} = response
            if (data) {
                dispatch(actions.saveOTPMethods(data?.otp_methods))
                return data
            }
        }).catch(err => {
            apiError(err)
            return undefined


        })


    } catch (e) {

    }


}


export const submitWithdrawRequest = (params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().post('withdrawal/request', params).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            console.log(err);
            apiError(err)

            return undefined
        })
    } catch (e) {

    }
}


export const cancelBooking = (params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().post('cancellation/request', params).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            apiError(err)
            return undefined
        })
    } catch (e) {

    }
}


export const verifySubmitRequest = (path, params) => (dispatch) => {
    try {


        return RestApi.getInstanceV2().post(path, params).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            apiError(err)

            return undefined

        })


    } catch (e) {

    }


}


export const resolveDeeplink = (params) => (dispatch) => {
    try {


        return RestApi.getJSInstance().post("resolve-deeplink", params).then((response) => {
            const {data} = response

            // let obj = {
            //   app: {
            //     route: 'Buses',
            //     params: {
            //       screen: 'BusesSearchScreen',
            //       params: {
            //         searchData: {
            //           serviceItem: {
            //             service_name: 'All Bus Services',
            //             isAllService: true,
            //             serviceId: -1,
            //           },
            //           origin: {
            //             id: '1',
            //             name: 'Lahore',
            //             nameu: '',
            //             short_name: 'LHE',
            //             lat: '',
            //             lng: '',
            //           },
            //           destination: {
            //             id: '4',
            //             name: 'Multan',
            //             nameu: '',
            //             short_name: 'MTN',
            //             lat: '',
            //             lng: '',
            //             is_connecting: false,
            //           },
            //           depDate: '2026-03-27',
            //           isOneWay: true,
            //         },
            //       },
            //     },
            //   },
            // };
            //    return obj
            return data
        }).catch(err => {
            apiError(err)
            return undefined

        })


    } catch (e) {

    }


}

export const cancelWithDrawRequest = (path, params) => (dispatch) => {
    try {
        return RestApi.getInstanceV2().post(path, params).then((response) => {
            const {data} = response
            return data
        }).catch(err => {
            apiError(err)
            return undefined

        })


    } catch (e) {

    }


}


export const countPN = () => (dispatch) => {
    const state = store.getState()
    dispatch(actions.savePNCount(state.app.msgCount + 1))
}
export const resetPNCount = () => (dispatch) => {
    dispatch(actions.savePNCount(0))
}

export const finishIntro = (dispatch) => {
    dispatch(actions.finishIntro())
    dispatch(CommonActions.navigate({
        name: 'home'
    }))
}
