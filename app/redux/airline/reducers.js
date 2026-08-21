import * as types from './types'

const initialState = {

    isFetching: false,
    airlineSetting:null,
    searchObj: undefined,
    baggageInfo: undefined,
    mealInfo: undefined,
    seatInfo: undefined,
    airlineObj:undefined,
    ssrInfo: undefined,
    accessToken: null,
    recentSearch:null,
    progressCount:0,
    home:null,
    popularAirports:[],
    airports:[],
    calendarFares:[],
    searchResult:[],
    copySearchResult:[],
    filters:null,
  charges:[],
  passengers:[]

}
export default (state = initialState, action) => {
    const {type, payload} = action
    switch (type) {


        case types.IS_FETCHING: {

            return {
                ...state,
                isFetching: payload
            }

        }
        case types.SAVE_AIRELINE_OBJECT: {

            return {
                ...state,
                searchObj: payload
            }

        }
        case types.SAVE_HOME_DATA: {

            return {
                ...state,
                home: payload
            }

        }
        case types.SAVE_RECENT_AIRLINE_SEARCH: {

            return {
                ...state,
                recentSearch: payload
            }

        }
        case types.SAVE_POPULAR_AIRPORTS: {

            return {
                ...state,
                popularAirports: payload
            }

        }
        case types.SAVE_MODIFY_CHANGES: {

            return {
                ...state,
                charges: payload?.Charges,
                passengers: payload?.Passengers,
            }

        }
        case types.SAVE_PROGRESS_COUNT: {

            return {
                ...state,
                progressCount: payload
            }

        }
       case types.FLIGHT_DETAIL: {

            return {
                ...state,
                airlineObj: payload
            }

        }

        case types.SAVE_AIRLINE_SETTING: {
            return {
                ...state,
                airlineSetting: payload
            }
        }
        case types.SAVE_BAGGAGE_INFO: {
            return {
                ...state,
                baggageInfo: payload
            }
        } case types.SAVE_CALENGER_FARES: {
            return {
                ...state,
                calendarFares: payload
            }
        } case types.SAVE_SEAT_INFO: {
            return {
                ...state,
                seatInfo: payload
            }
        } case types.SAVE_MEAL_INFO: {
            return {
                ...state,
                mealInfo: payload
            }
        } case types.SAVE_SSR_INFO: {
            return {
                ...state,
                ssrInfo: payload
            }
        }
        case types.SAVE_TOKEN: {

            return {
                ...state,
                accessToken: payload
            }

        }


        case types.SAVE_AIRPORTS: {

            return {
                ...state,
                airports: payload
            }

        }

        case types.SAVE_AIRLINE_FILTERS: {

            return {
                ...state,
                filters: payload,
                isFetching: false
            }

        }



        default:
            return state

    }
}


