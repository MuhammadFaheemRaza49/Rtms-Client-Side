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
};

export default Constants;
