/** @format */

const Color = {
  // Brand / Header Colors (Updated to match Bus App sapphire blue)
  headerBlue: '#0C4DA8',         // Centralized sapphire blue for the header container
  inputBackground: 'rgba(255, 255, 255, 0.12)', // Semi-transparent white for input fields
  inputBorder: 'rgba(255, 255, 255, 0.3)',      // Light white border for input fields

  // Theme Backgrounds
  background: '#F5F6F8',         // Very light grey screen background
  surface: '#FFFFFF',            // White for restaurant cards
  border: '#E5E7EB',             // Soft grey for dividers and divider lines
  borderColor: '#f2f4f5',
  borderColor2: '#E6E6E6',
  borderColor3: '#475569',

  // Status & Utility Colors
  available: '#2ECC71',
  occupied: '#3B82F6',
  reserved: '#F39C12',
  selected: '#0C4DA8',            // Sapphire blue for selected items (matches headerBlue)
  starColor: '#F5A623',          // Orange/gold color for rating stars

  // Text Colors
  textPrimary: '#1E2937',        // Deep dark grey/black for headers and names
  textSecondary: '#6B7280',      // Medium grey for locations and subtitled info
  textMuted: '#9CA3AF',          // Light grey for tax labels

  // Basic colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Dynamic values to match Bus App header search styling
  layer_color: '#83b2e7ff',                       // Search bar border and search input placeholder
  fieldOpacity: 'rgba(255, 255, 255, 0.1)',     // Search bar inside background
  fieldTextColor: '#FFFFFF',                    // Entered/selected text color
  placeholderColor: 'rgba(255, 255, 255, 0.64)', // Selector placeholder color

  // New centralized color scheme system values
  delete: '#DC2626',
  error: '#f44336',
  facebook: '#3b5998',
  google: '#d34836',
  tagBackground: '#F6F9FD',
  greyBackground: '#F2F4F7',
  fieldBackground: 'rgba(255, 255, 255, 0.1)',
  placeholderColor: 'rgba(255, 255, 255, 0.64)',
  borderBlueColor: '#6A91CF',
  backgroundHighlighter: '#EFF6FF',
  umrahPrimary: '#12413B',
  secondary: '#ECB330',
  greyText: '#64748B',
  greyText2: '#6B7280',
  secondaryHighlighter: '#FFFCF5',
  borderGrey: '#E2E8F0',
  borderGrey2: '#E4E4E4',
  gray100: '#F3F4F6',
  gray50: '#F8FAFC',
  gray200: '#7589A5',
  onBoardingBlue: '#DBEAFE',
  lightPrimary: '#EFF6FF',
  orangeBackground: '#FFF9EE',
  orangeText: '#F6AF3A',
  main: '#fff',
  primaryDark: '#0097a7',
  rippleColor: '#0556a0',
  primary: '#0C4DA8',
  redBackgroundHighligther: '#FFF3F0',
  greenHighlighter: '#F0FDF4',
  greyTextOnBlue: '#FFFFFFCC',
  greenUmrah: '#16A34A',
  primaryLight: '#E1EAF7',
  lightBlue100: '#E8F1FF',
  accent: '#00A859',
  accentLight: '#FFD54F',
  spinnerGold: '#F1E07C',
  gray: 'gray',
  orange: '#F2711C',
  olive: '#B5CC18',
  green: '#3ABF38',
  darkGreen: '#15803D',
  teal: '#00B5AD',
  blue: '#2185D0',
  violet: '#6435C9',
  violet200: '#DDD6FE',
  purple: '#A333C8',
  pink: '#E03997',
  brown: '#A5673F',
  whatsappPrimaryColor: '#25D366',
  heading_color: '#003761',
  grey40: '#FAFAFA',
  grey60: '#95A0B0',
  grey70: '#F1F5F9',
  grey80: '#F9FAFB',
  grey90: '#E5E7EB',
  greyUnselected: '#D9D9D9',
  regular_text_color: '#949494',
  theme_color: '#0C4DA8',
  light_orange: '#fde1b8',
  dark_orange: '#f38d5b',
  yellow: '#c9b62c',
  disabled_color: '#949494',
  yellow_btn_color: '#f6b400',
  stepActive: '#2AB5B3',
  stepInActive: 'rgba(207, 212, 216, 0.8)',

  blackTextPrimary: 'rgba(0,0,0,1)',
  blackTextSecondary: 'rgba(0, 0, 0, 0.5)',
  blackTextDisable: 'rgba(0,0,0,0.3)',
  lightTextPrimary: 'rgba(255,255,255,1)',
  lightTextSecondary: 'rgba(255,255,255,255.5)',
  lightTextDisable: 'rgba(255,255,255,0.3)',

  lightDivide: 'rgba(255, 255, 255, 0.12)',
  blackDivide: 'rgba(0, 0, 0, 0.05)',

  zinc600: '#52525B',
  Background: '#FFFFFF',
  DirtyBackground: '#F0F0F0',
  Error: '#f96b6b',
  darkBlueText: '#0F172A',
  gold: '#FCD34D',
  lightGold: '#FEF3C7',
  goldBrown: '#92400E',
  slate800: '#1E293B',
  white20: 'rgba(255, 255, 255, 0.2)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white35: 'rgba(255, 255, 255, 0.35)',
  zinc900: '#18181B',
  zinc500: '#71717A',
  overlay: '#3C3C3C',

  blueLight: '#EFF6FF',
  blueGradientDark: '#9DC6FF',
  blueGradientLight: '#DBEBFF',
  blueBackground: '#BFDBFE',

  bronze: '#BF603E',
  bronzeLight: '#FFF7ED',
  bronzeGradientDark: '#FFAE8F',
  bronzeGradientLight: '#FFE4D4',
  bronzeBannerDark: '#FFB597',
  bronzeBannerLight: '#FFEBE2',
  bronzeBackground: '#FFBFA8',

  silver: '#6B6B6B',
  silverLight: '#F4F4F5',
  silverGradientDark: '#9F9F9F',
  silverGradientLight: '#E9E9E9',
  silverBackground: '#CACACA',
  silverBannerDark: '#AAAAAA',
  silverBannerLight: '#F3F3F3',

  golden: '#FFA600',
  goldenLight: '#FEFCE8',
  goldenGradientDark: '#FFC851',
  goldenGradientLight: '#FFEFC4',
  goldenBackground: '#FFD89A',
  goldenBannerDark: '#FFBF35',
  goldenBannerLight: '#FFF0C7',

  platinum: '#989898',
  platinumLight: '#FAFAFA',
  platinumGradientDark: '#C9C9C9',
  platinumGradientLight: '#F8F8F8',
  platinumBackground: '#DDDDDD',
  platinumBannerDark: '#B8B8B8',
  platinumBannerLight: '#FFFFFF',

  blue950: '#172554',
  blue100: '#DBEAFE',

  cancelledBg: 'rgba(209,20,51,0.37)',
  cancellText: '#D11433',

  activeBg: 'rgba(20, 209, 89, .37)',
  active: '11b66a',

  pendingBg: 'rgba(173,181,189,0.38)',
  pending: '#adb5bd',

  Toolbar: 'white',
  ToolbarText: '#283747',
  ToolbarIcon: '#283747',

  ToolbarTrans: 'transparent',
  ToolbarTextTrans: 'black',
  ToolbarIconTrans: 'black',
  bookmeBroColor: '#662499',
  bookemBroMedium: '#CB88FF',
  TopBar: 'white',
  TopBarIcon: '#283747',

  ButtonBackground: '#00aef0',
  ButtonText: 'white',
  ButtonBorder: '#bcbebb',

  TabActive: '#00BCD4',
  TabDeActive: 'white',
  TabActiveText: '#333',
  TabText: '#333',
  BuyNowButton: '#00BCD4',
  OutOfStockButton: '#a44',

  ViewBorder: '#bcbebb',

  Text: '#585858',
  TextDefault: '#585858',
  TextNormal: '#77a464',
  TextLight: 'darkgray',
  TextDark: '#000000',
  yellow_color: '#CA8A04',

  SideMenuBg: 'rgba(12, 77, 168, 0.9)',
  SideMenuText: 'rgba(0, 0, 0, 0.7)',
  SideMenuTextActived: '#000',
  SideMenuIcon: 'white',

  tabbar: 'rgba(255, 255, 255, 1)',
  get tabbarTint() {
    return this.primary;
  },
  tabbarColor: '#000',

  get headerTintColor() {
    return this.primary;
  },
  navigationBarColor: '#ffffff',
  navigationBarIcon: 'rgba(0, 0, 0, 0.3)',
  navigationTitleColor: 'rgba(0, 0, 0, 0.8)',

  heartActiveWishList: 'rgba(252, 31, 74, 1)',

  spin: '#333333',

  attributes: {
    black: '#333',
    red: '#DF3737',
    green: '#2AB5B3',
    blue: '#38B1E7',
    yellow: '#FDF12C',
  },
  lightGrey: 'rgba(247, 248, 250, 1)',
  lightGrey1: 'rgba(212, 220, 255, 1)',
  darkOrange: 'rgba(255, 132, 11, 1)',
  darkYellow: 'rgba(255, 164, 31, 1)',
  darkRed: '#8B0000',
  red: '#E01F26',
  lightgrey: '#999999',
  lightBlue: '#9ddaff',
  blue1: 'rgba(30, 165, 233, 1)',
  blue2: 'rgba(3, 207, 254, 1)',
  grey2: '#adb5bd',
  orange100: '#FFEDD5',
  orange200: '#FED7AA',
  blue300: '#93C5FD',
  blue50: '#EFF6FF',
  fieldOpacity: 'rgba(255, 255, 255,.1)',
  gray400: '#9CA3AF',
};

export const white = '#efefef';
export const grey1 = '#f7f7f7';
export const grey2 = '#dddddd';
export const grey3 = '#b8b4b6';
export const grey4 = '#7b7b7b';
export const grey5 = '#999999';
export const grey6 = '#777777';
export const grey7 = '#383838';
export const grey8 = '#1e1e1e';
export const grey9 = '#2C2C2C';
export const black = '#0F172A';
export const black2 = '#292929';
export const primary = '#0C4DA8';
export const darkPrimary = '#212242';
export const darkSecondary = '#262b49';
export const lightblack = '#292929';
export const darkgrey = '#7b7b7b';
export const lightPrimary = '#EFF6FF';
export const darkBluish = '#0F172A';
export const BorderColor2 = '#0F172A';
export const blue300 = '#93C5FD';
export const umrahPrimary = '#12413B';

export const lightTheme = {
  colors: {
    ...Color,
  },
};

export default Color;
