import { Images } from './index';
import moment from 'moment';
import { showLocation } from 'react-native-map-link';
import { PhoneNumberUtil } from 'google-libphonenumber';
import Validator from './Validator';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
// import {toast} from '../Omni';
import RNFS from 'react-native-fs';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';

const phoneUtil = PhoneNumberUtil.getInstance();


async function requestPermission() {
  if (Platform.OS === 'android') {
    try {
      const sdk = Number(Platform.Version) || 0;

      // Android 10+ (API 29+): no storage permission needed for MediaStore / app storage
      if (sdk >= 29) return true;

      // Android 9 and below: request legacy write permission
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const alreadyGranted = await PermissionsAndroid.check(permission);
      if (alreadyGranted) return true;

      const result = await PermissionsAndroid.request(permission, {
        title: 'Storage permission',
        message: 'Allow storage access to save files to your device.',
        buttonNeutral: 'Ask me later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission needed',
          'To save files to your device, enable Storage permission in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }

      return false;
    } catch (err) {
      console.warn('Android permission error:', err);
      return false;
    }
  } else {
    return true
  }
}

export default class Tools {
  static getNoOfDays = (depDatee, returnDatee) => {
    const days = moment(returnDatee, 'YYYY-MM-DD').diff(
      moment(depDatee, 'YYYY-MM-DD'),
      'days',
    );
    return `${days} days`;
  };

  static requestMediaPermission() {
    return requestPermission();
  }

  static getName = user => {
    if (user) {
      if (user.name) return user.name;
      return 'Guest';
    }
    return 'Guest';
  };
  static getStatusBarHeight() {
    if (Platform.OS === 'ios') {
      return 0;
    }
    return StatusBar.currentHeight;
  }
  static handleNameSplit = name => {
    let values = name?.split(' ');
    return {
      firstName: values[0],
      lastName: values[1] ? name.substr(name.indexOf(' ') + 1) : '',
    };
  };
  static calculateTax(platformFee, taxType, taxRate) {
    if (!taxType || taxRate === 0) return 0;

    // taxRate can be 0 (valid)
    return Number(
      (parseFloat(platformFee) * (parseFloat(taxRate) / 100)).toFixed(2),
    );
  }
  static getTripTypeLabel(key) {
    const tripTypeMap = {
      one_way: 'One Way',
      return: 'Return',
      multi_city: 'Multi City',
    };
    return tripTypeMap[key] || 'Unknown';
  }

  static emailPhoneValidation = (
    t,
    email,
    phoneRef,
    setEmailErr,
    setPhoneErr,
  ) => {
    let isError = false;
    const emailValid = Validator.checkEmail(email?.trim());
    if (emailValid) {
      isError = true;
      setEmailErr(t('auth:invalidEmail'));
    }
    const phoneValid = phoneRef?.current?.isValidNumber();
    if (!phoneValid) {
      isError = true;
      setPhoneErr(t('auth:invalidPhone'));
    }
    return !isError;
  };

  static priceFormat(fare) {
    return fare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static getLocalizedValue(obj, key, language, fallback = '') {
    return obj?.[key]?.[language] || obj?.[key] || fallback;
  }

  static returnIntlNumber(number, iso) {
    if (
      iso &&
      number &&
      typeof number === 'string' &&
      typeof iso === 'string'
    ) {
      let data = phoneUtil.parseAndKeepRawInput(number, iso);
      return data.getCountryCode() + '' + data.getNationalNumber();
    }
  }

  static formatToK(number) {
    if (number > 0) {
      if (number >= 1000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return number.toString();
    }
  }

  static getNationalIDRegex() {
    return '^[0-9]{5}-[0-9]{7}-[0-9]$';
  }

  static getAvatar = user => {
    // alert(JSON.stringify(user?.picture))

    if (user?.thumb && user?.thumb !== '') {
      return {
        uri: user?.thumb,
      };
    } else {
      return Images.defaultAvatar;
    }
  };

  static secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? ' h ' : 'h ') : '0h';
    const mDisplay = m > 0 ? m + (m === 1 ? ' m ' : 'm ') : '0m';
    const sDisplay = s > 0 ? s + (s === 1 ? ' s ' : 's ') : '0s';
    return hDisplay + ' ' + mDisplay + ' ' + sDisplay;
  }

  static secondsToHmsBooking(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 9 ? h : '0' + h;
    const mDisplay = m > 9 ? m : '0' + m;
    const sDisplay = s > 9 ? s : '0' + s;
    return hDisplay + ':' + mDisplay + ':' + sDisplay;
  }

  static secondsToMinutesDashboard(d) {
    d = Number(d);
    if (isNaN(d)) {
      return '00 : 00 : 00'; // or handle invalid input gracefully
    }
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 9 ? h : '0' + h;
    const mDisplay = m > 9 ? m : '0' + m;
    const sDisplay = s > 9 ? s : '0' + s;
    return hDisplay + ' : ' + mDisplay + ' : ' + sDisplay;
  }

  static convertDateTimeToMinutes(dateTime) {
    const date = moment(dateTime);
    return date.unix() / 60;
  }
  static remaingDailTime(userInfo, datee) {
    const values = userInfo.user;
    if (values.daily_point_date) {
      try {
        const remaingtime =
          moment(values.daily_point_date, 'YYYY-MM-DD HH:mm:ss').unix() +
          86400 -
          datee;
        if (remaingtime > 0) {
          return remaingtime;
        } else {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  static remaingDailyCheckinTime(time, datee) {
    if (time) {
      try {
        const remaingtime = moment(time, 'YYYY-MM-DD HH:mm:ss').unix() - datee;
        if (remaingtime > 0) {
          return remaingtime;
        } else {
          return undefined;
        }
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  static remaingBookingTime(timmer, datee) {
    try {
      const remaingtime = moment(timmer).unix() - datee;
      if (remaingtime > 0) {
        return remaingtime;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  }

  static getCityNameFromAddress(responseJson, logisticCities) {
    let scityname = '';
    for (let mainObject of responseJson.results) {
      for (let object of mainObject.address_components) {
        if (
          logisticCities.filter(
            item =>
              item.name.toLowerCase() === object?.short_name.toLowerCase(),
          ).length > 0
        ) {
          scityname = object.short_name;
        }
      }
    }
    if (scityname === '') {
      let leghth = responseJson.results[0].address_components.length;
      scityname =
        responseJson.results[0].address_components[leghth > 3 ? leghth - 3 : 0]
          .short_name;
    }
    return scityname;
  }

  static getFileTypeFromUrl(url = '') {
    const cleanUrl = url.split('?')[0].toLowerCase();

    if (cleanUrl.endsWith('.pdf')) return 'pdf';
    if (cleanUrl.match(/\.(jpg|jpeg|png|webp)$/)) return 'image';

    return 'unknown';
  };

  static convertToFormData(params) {
    const formData = new FormData();

    Object.entries(params).forEach(([key, value]) => {
      const isFile =
        value &&
        typeof value === 'object' &&
        'uri' in value &&
        'name' in value &&
        'type' in value;

      if (isFile) {
        formData.append(key, {
          uri: value.uri,
          name: value.name || 'photo.jpg',
          type: value.type || 'image/jpeg',
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return formData;
  }

  static async downloadFile(fileUrl, filename) {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        toast('Storage permission is required to download files');
        return undefined;
      }

      const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

      const result = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localPath,
      }).promise;

      if (result.statusCode !== 200) {
        console.log('Download failed:', result.statusCode);
        return undefined;
      }

      return `file://${localPath}`;
    } catch (err) {
      console.log('Download/save error:', err);
      return undefined;
    }
  }

  static minutesConvertor(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return hours + 'h ' + mins + 'm';
  }

  static convertHoursToMin(timesInHour) {
    if (typeof timesInHour === 'string') {
      const [hours, minutes] = timesInHour
        .replace('h', '')
        .replace('m', '')
        .split(' ');
      return parseInt(hours) * 60 + parseInt(minutes);
    }
  }

  static sortAscending = notification => {
    return notification.sort(this.compareValues('date', 'desc'));
  };

  static isJSON = data => {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      console.log('JSON Error', e);
      return false;
    }
  };

  static compareValues(key, order = 'asc') {
    return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == 'desc' ? comparison * -1 : comparison;
    };
  }

  static formatTitleCase(input) {
    if (!input) return '';

    return input
      .toLowerCase()
      .replace(/[_\s]+/g, ' ') // replace underscores or multiple spaces with a single space
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1).toLowerCase();
  }

  static getTodayAndTomorrow() {
    return {
      today: moment().format('YYYY-MM-DD'),
      tomorrow: moment().add(1, 'day').format('YYYY-MM-DD'),
    };
  }

  static getTomorrowAndDayAfterTomorrow() {
    return {
      today: moment().format('YYYY-MM-DD'),
      tomorrow: moment().add(1, 'day').format('YYYY-MM-DD'),
      dayAfterTomorrow: moment().add(2, 'day').format('YYYY-MM-DD'),
    };
  }

  static getDateAfterGivenDays(days = 1, format = 'YYYY-MM-DD') {
    return moment().add(days, 'day').format(format);
  }
  static getValidAlphabetsOnly(s) {
    return /^[\p{L}\s]+$/u.test(s);;
  }

  static everFirstLetter(splitStr) {
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1) + '  ';
    }
    return splitStr;
  }

  static nextSixDays(date) {
    let dateList = [];
    let tomorrow = moment(date).format('YYYY-MM-DD');
    for (let i = 0; i <= 6; i++) {
      dateList[i] = tomorrow;
      tomorrow = moment(tomorrow).add(1, 'day').format('YYYY-MM-DD');
    }
    return dateList;
  }

  static openMap(lat, lng) {
    showLocation({
      latitude: lat,
      longitude: lng,
      // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
      // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
      // title: 'The White House',  // optional
      googleForceLatLon: true, // optionally force GoogleMaps to use the latlon for the query instead of the title
      // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
      alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
      // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
      // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
      appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      // app: 'uber'  // optionally specify specific app to use
    });
  }

  static cityFromService(item) {
    let busCitiesList = [];
    for (let i = 0; i < item.departure.length; i++) {
      let destination = [];
      for (let dest of item.departure[i].destionation) {
        destination.push({
          id: dest.destination_common_id,
          name: dest.destination_city_name,
          nameu: dest.destination_city_nameu,
          short_name: dest.destination_short,
          lat:
            dest.destination_lat == ''
              ? 24.8607
              : parseFloat(dest.destination_lat),
          lng:
            dest.destination_lng == ''
              ? 67.0011
              : parseFloat(dest.destination_lng),
        });
      }
      busCitiesList.push({
        id: item.departure[i].origin_common_id,
        name: item.departure[i].origin_city_name,
        nameu: item.departure[i].origin_city_nameu,
        short_name: item.departure[i].origin_short,
        lat:
          item.departure[i].origin_lat == ''
            ? 24.8607
            : parseFloat(item.departure[i].origin_lat),
        lng:
          item.departure[i].origin_lng == ''
            ? 67.0011
            : parseFloat(item.departure[i].origin_lng),
        destination: destination,
      });
    }

    return busCitiesList;
  }

  static getFileStoragePermission = () => {
    return request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            toast(
              'This feature is not available (on this device / in this context)',
            );
            return true;
          case RESULTS.DENIED:
            toast(
              'The permission has not been requested / is denied but requestable',
            );
            return true;
          case RESULTS.LIMITED:
            toast('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            // toast('The permission is granted');
            return true;
          case RESULTS.BLOCKED:
            toast('The permission is denied and not requestable anymore');
            return true;
        }
      })
      .catch(error => { });
  };

  static isHTML = data => {
    return /<\/?[a-z][\s\S]*>/i.test(data);
  };

  static textOfStatus = status => {
    if (status === 'unpaid') {
      return 'You payment is unpaid';
    }
    return status;
  };

  static getLevenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0),
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost, // substitution
        );
      }
    }

    return matrix[a.length][b.length];
  }

  static getFormattedDate(
    date,
    currentFormat = 'YYYY-MM-DDTHH:mm:ssZ',
    requiredFormat = 'YYYY-MM-DD',
  ) {
    return moment(date, currentFormat).format(requiredFormat);
  }

  static getValidNameString(str) {
    return /^[\p{L}\s]+$/u.test(str);
  }

  static formatNumber(value) {
    if (!value || isNaN(value)) return '';

    const num = Number(value);
    const [intPart, decPart] = num.toString().split('.');

    // Add commas to integer part
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Preserve decimal part if exists
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }
}
