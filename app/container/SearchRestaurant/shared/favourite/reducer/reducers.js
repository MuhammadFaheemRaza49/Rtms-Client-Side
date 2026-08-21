import {
  CHANGE_NICK_NAME,
  CHANGE_FIRSTNAME,
  CHANGE_LASTNAME,
  CHANGE_PHONENO,
  CHANGE_EMAIL,
  ONERROR,
  ONCHNAGECNIC,
  CHANGE_DOB,
  ONCHANGECOUNTRY,
  ONCHANGEPASSPORT,
  CHNANGE_ISSUE_COUNTRY,
  CHANGE_PASSPORT_EXPIRY,
  ON_CHANGE_ID_TYPE,
  CHANGE_GENDER,
  CHANGE_PASSPORT_ISSUANCE,
  SET_SELECTED_CONTACTS
} from './types'

export const INTAIAL_STATE = {
  nickName: '',
  nickNameError: undefined,
  firstName: '',
  firstNameError: undefined,
  lastName: '',
  prefix:null,
  errorPrefix:undefined,
  lastNameError: undefined,
  phoneNumber: '',
  phoneNumberError: undefined,
  countryCode: '',
  email: '',
  cnic: '',
  iso: '',
  isCnic:true,
  cnicError: undefined,
  emailError: undefined,
  dob: undefined,
  dobError: undefined,
  country: { code: 'PK', name: 'Pakistan' },
  passportNo: '',
  passportNoError: undefined,
  passportIssueCountry: { code: 'PK', name: 'Pakistan' },
  passportExpiry: undefined,
  gender: 0,
  city: '',
  passportExpiryError: undefined,
  selectedContact:-1
}

export const VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]

export const AIRLINE_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: true },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]
export const BUS_VERTICAL_LIST = [
  { title: 'Bus', isSelected: true },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]
export const CAR_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: true },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]

export const MOVIE_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: true },
  { title: 'Event', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]
export const EVENT_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Event', isSelected: true },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false }
]

export const TRAVEL_INSURANCE_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Insurance', isSelected: true },
  { title: 'Railway', isSelected: false },
  { title: 'Umrah', isSelected: false }
]
export const UMRAH_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Railway', isSelected: false },
  { title: 'Umrah', isSelected: true }
]
export const RAILWAY_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: false },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false },
  { title: 'Railway', isSelected: true }
]
export const HOTEL_VERTICAL_LIST = [
  { title: 'Bus', isSelected: false },
  { title: 'Airline', isSelected: false },
  { title: 'Cargo', isSelected: false },
  { title: 'Hotel', isSelected: true },
  { title: 'Car', isSelected: false },
  { title: 'Movie', isSelected: false },
  { title: 'Event', isSelected: false },
  { title: 'Insurance', isSelected: false },
  { title: 'Umrah', isSelected: false },
  { title: 'Railway', isSelected: false }
]

export const reducer = (state, data) => {
  const { type, payload } = data
  switch (type) {
    case CHANGE_NICK_NAME:
      return { ...state, nickName: payload, nickNameError: undefined }
    case CHANGE_FIRSTNAME:
      return { ...state, firstName: payload, firstNameError: undefined }
    case CHANGE_LASTNAME:
      return { ...state, lastName: payload, lastNameError: undefined }
    case CHANGE_PHONENO:
      return { ...state, ...payload, phoneNumberError: undefined }
    case CHANGE_EMAIL:
      return { ...state, email: payload, emailError: undefined }
    case ONERROR:
      return { ...state, ...payload }
    case ONCHNAGECNIC:
      return { ...state, cnic: payload, cnicError: undefined }
    case ON_CHANGE_ID_TYPE :
      return { ...state, isCnic: payload}
    case CHANGE_DOB:
      return { ...state, dob: payload, dobError: undefined }
    case ONCHANGECOUNTRY:
      return { ...state, country: payload }
    case ONCHANGEPASSPORT:
      return { ...state, passportNo: payload, passportNoError: undefined }
    case CHNANGE_ISSUE_COUNTRY:
      return { ...state, passportIssueCountry: payload }
    case CHANGE_PASSPORT_EXPIRY:
      return { ...state, passportExpiry: payload, passportExpiryError: undefined }
    case CHANGE_PASSPORT_ISSUANCE:
      return { ...state, passportIssuance: payload, passportIssuanceError: undefined }
    case CHANGE_GENDER:
      return { ...state, prefix: payload,errorPrefix:undefined }
    default:
      return state
  }
}
