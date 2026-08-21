import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const Constants = {
  screenWidth: width,
  screenHeight: height,
  isIOS: Platform.OS === 'ios',
  
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    round: 24,
  },
  
  spacing: {
    tiny: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },
  
  fontSize: {
    caption: 11,
    bodySmall: 12,
    body: 14,
    subheading: 15,
    title: 17,
    header: 20,
  },

  sizes: {
    base: 14,
    h1: 30,
    h2: 24,
    h3: 20,
    h4: 16,
    h5: 14,
    h6: 12,
    h7: 11,
    h8: 10,
  },

  fontFamilyRegular: 'Inter-Light',
  fontFamilyMedium: 'Inter-Medium',
  fontFamilyBold: 'Inter-SemiBold',
  fontFamilyRegularArabic: 'Inter-Light',
  fontFamilyMediumArabic: 'Inter-Medium',
  fontFamilyBoldArabic: 'Inter-SemiBold',
  fontFamilyMediumItalic: 'Inter-Medium',
  fontFamilyRegularItalic: 'Inter-Light',

  Layout: {
    card: 1,
    twoColumn: 2,
    simple: 3,
    list: 4,
    advance: 5,
    threeColumn: 6,
    horizon: 7,
    twoColumnHigh: 8,
    miniBanner: 9,
  },
};

export default Constants;
