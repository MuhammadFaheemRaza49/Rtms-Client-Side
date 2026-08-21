import {Linking, Dimensions} from 'react-native';

const globals = {
  AppVersion: '1.0',
  API_KEY: '',
  AUTH_TOKEN: '',
  BUS_SERVICE_ID: 0,

  theme_color: '#1552B3',
  heading_color: '#003761',
  regular_text_color: '#949494',

  semi_bold: 'Inter-SemiBold',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',

  Screenwidth: Dimensions.get('window').width,
  Screenheight: Dimensions.get('window').height,

  FirebaseEventsNew: () => {},
  FirebaseEventsWithData: () => {},
  FirebaseVerticalEvent: () => {},

  currencyCodeToSymbol: code => {
    const map = {
      USD: '$',
      EUR: '\u20AC',
      GBP: '\u00A3',
      SAR: 'SAR ',
      AED: 'AED ',
      PKR: 'Rs ',
    };
    return map[code] ?? `${code ?? ''} `;
  },

  priceUnitFormat: value => `${value ?? 0}`,

  convertMinsToHours: mins => {
    const total = Number(mins) || 0;
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (h <= 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  },

  openTheUrl: url => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  },
};

export default globals;
