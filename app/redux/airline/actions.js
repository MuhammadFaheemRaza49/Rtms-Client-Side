import * as types from "./types";
import {SAVE_CALENGER_FARES} from "./types";


export const saveAccessToken = (token) => ({
    type: types.SAVE_TOKEN,
    payload: token,
});
export const saveHomeInfoAirports = (data) => ({
    type: types.SAVE_HOME_DATA,
    payload: data,
});
export const saveAirlineRecentSearch = (data) => ({
    type: types.SAVE_RECENT_AIRLINE_SEARCH,
    payload: data,
});
export const savePopularAirports = (data) => ({
    type: types.SAVE_POPULAR_AIRPORTS,
    payload: data,
});
export const saveAirports = (data) => ({
    type: types.SAVE_AIRPORTS,
    payload: data,
});
export const saveCalendarFares = (data) => ({
    type: types.SAVE_CALENGER_FARES,
    payload: data,
});
export const saveAirlineObj = (data) => ({
    type: types.SAVE_AIRELINE_OBJECT,
    payload: data,
});
export const saveFlightDetails = (data) => ({
    type: types.FLIGHT_DETAIL,
    payload: data
})

export const saveModifyChanges = (data) => ({
    type: types.SAVE_MODIFY_CHANGES,
    payload: data
})

export const saveBaggageInfo = (data) => ({
    type: types.SAVE_BAGGAGE_INFO,
    payload: data,
});
export const saveSeatInfo = (data) => ({
    type: types.SAVE_SEAT_INFO,
    payload: data,
});
export const saveMealInfo = (data) => ({
    type: types.SAVE_MEAL_INFO,
    payload: data,
});
export const saveSsrInfo = (data) => ({
    type: types.SAVE_SSR_INFO,
    payload: data,
});


export const setLoading = (data) => ({
    type: types.IS_FETCHING,
    payload: data,
});

export const saveProgressCount = (data) => ({
    type: types.SAVE_PROGRESS_COUNT,
    payload: data,
});

export const saveSearchResult = (data) => ({
    type: types.SAVE_SEARCH_RESULT,
    payload: data,
});

export const saveCopySearchResult = (data) => ({
    type: types.COPY_SEARCH_RESULT,
    payload: data,
});
export const saveAirlineSetting = (data) => {
    return ({
        type: types.SAVE_AIRLINE_SETTING,
        payload: data
    })
}

export const saveAirlineFilters = (data) => ({
    type: types.SAVE_AIRLINE_FILTERS,
    payload: data,
});

export const applySorting = (data) => ({
    type: types.APPLY_SORTING,
    payload: data,
});

export const applyFilters = (data) => ({
    type: types.APPLY_FITLER,
    payload: data,
});

export const resetFilterStops = (data) => ({
    type: types.APPLY_FITLER,
    payload: data,
});
