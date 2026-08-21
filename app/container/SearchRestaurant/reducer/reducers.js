import {
  APPLY_SORTING,
  CHANGE_FACILITIES_ITEM,
  CHANGE_SELECTED_FILTER,
  CHANGE_SORTING_ITEM,
  RESET_FACILITIES,
  CHANGE_BUS_TYPE,
  CHANGE_BUS_SERVICE,
  RESET_FACILITIES_FILTER,
  SAVE_BUS_TIMES,
  UPDATE_PRICE_FILTER, NO_BUS_TIMES
} from './types'
// import { compareValues } from '../../../../globals'
import { APPLY_FILTER, RESET_BUS_TYPE_FILTER, RESET_FILTER } from '../../../redux/bus/types'

const sortTypeFilter = [
  { title: 'Recommended', value: 'service_priority', sort: 'asc', status: true },
  { title: 'Cheapest', value: 'fare', sort: 'asc', status: false },
  { title: 'Fastest', value: 'durationInMinutes', sort: 'asc', status: false },
  { title: 'Earliest', value: 'dep_time_minutes', sort: 'asc', status: false }
]
export const filter = {
  DEFAULT: 'default',
  SORTING: 'sorting',
  PRICE: 'price',
  BUS_TYPE: 'bustype',
  DISCARD_OUTBOUND: 'discard_outbound'
}

export const INTAIAL_STATE = {
  busTimes: [],
  copyBusTimes: [],
  sortType: sortTypeFilter,
  defaultSortType: sortTypeFilter,
  selectedFilter: filter.DEFAULT,
  busType: [],
  busTypeDefault: [],
  busService: [],
  busServiceDefault: [],
  priceRange: [],
  priceRangeDefault: [],
  facilities: [],
  defaultFacilities: []
}

export const reducer = (state, data) => {
  const { type, payload } = data
  if (type === NO_BUS_TIMES) {
    return {
      ...state,
      ...INTAIAL_STATE
    }
  } else if (type === SAVE_BUS_TIMES) {
    return {
      ...state,
      busTimes: payload.times,
      copyBusTimes: payload.times,
      defaultFacilities: payload.facilities,
      priceRangeDefault: payload.priceRange,
      priceRange: payload.priceRange,
      busType: payload.busType,
      busTypeDefault: payload.busType,
      busService: payload.busService ?? [],
      busServiceDefault: payload.busService ?? []
    }
  } else if (type === APPLY_SORTING) {
    const sortedArray = applySorting(state.busTimes, [...payload])
    return { ...state, busTimes: [...sortedArray], sortType: [...payload] }
  } else if (type === CHANGE_SORTING_ITEM) {
    return { ...state, sortType: [...payload] }
  } else if (type === CHANGE_BUS_TYPE) {
    const filteredData = applyFilter({
      ...state,
      busType: [...payload]
    })
    return { ...state, busType: [...payload], busTimes: [...filteredData] }
  } else if (type === CHANGE_BUS_SERVICE) {
    const filteredData = applyFilter({
      ...state,
      busService: [...payload]
    })
    return { ...state, busService: [...payload], busTimes: [...filteredData] }
  } else if (type === APPLY_FILTER) {
    const filteredData = applyFilter(state)
    return { ...state, busTimes: [...filteredData] }
  } else if (type === CHANGE_SELECTED_FILTER) {
    return { ...state, selectedFilter: payload }
  } else if (type === UPDATE_PRICE_FILTER) {
    const filteredData = applyFilter({
      ...state,
      priceRange: payload
    })
    return { ...state, priceRange: payload, busTimes: [...filteredData] }
  } else if (type === RESET_FILTER) {
    state.priceRange = state.priceRangeDefault
    const filteredData = applyFilter(state)
    return { ...state, priceRange: state.priceRangeDefault, busTimes: filteredData }
  } else if (type === RESET_FACILITIES_FILTER) {
    state.priceRange = state.priceRangeDefault
    const filteredData = applyFilter(state)
    return { ...state, priceRange: state.priceRangeDefault, busTimes: filteredData }
  } else if (type === RESET_BUS_TYPE_FILTER) {
    const unSelect = state.busType.map(i => ({ ...i, isSelected: true }))
    const filteredData = applyFilter(state)
    return { ...state, busType: unSelect, busTimes: filteredData }
  } else {
    return state
  }
}

const applyFilter = (state) => {
  let filteredTimes = state.copyBusTimes.filter(item => item.fare >= state.priceRange[0] && item.fare <= state.priceRange[1])
  if (state.copyBusTimes.filter(item => item.is_connecting).length === 0 && state.busType.filter(service => service.isSelected).length > 0)
    filteredTimes = filteredTimes.filter(item => state.busType.filter(service => service.title === item.busname && service.isSelected).length > 0)

  if (state.copyBusTimes.filter(item => item.is_connecting).length === 0 && (state.busService ?? []).filter(service => service.isSelected).length > 0)
    filteredTimes = filteredTimes.filter(item => state.busService.filter(service => service.serviceId == item.service_id && service.isSelected).length > 0)

  return applySorting(filteredTimes, state.sortType)
}

const applySorting = (busTimes, sortType) => {
  const selectedSorting = sortType.find(item => item.status)
  return busTimes.sort(
    compareValues(selectedSorting.value, selectedSorting.sort)
  )
}
