import { Dimensions } from 'react-native';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scale factors are computed at call time (not module load) because some
// devices (e.g. OPPO/ColorOS on Android 16) report wrong window dimensions
// during JS init, which froze a ~3x factor for the whole session.
// Clamping keeps any bad OS-reported value from blowing up fonts/icons.
const MIN_FACTOR = 0.85;
const MAX_FACTOR = 1.4;

const clamp = factor => Math.min(Math.max(factor, MIN_FACTOR), MAX_FACTOR);

const getWidthFactor = () => {
  const { width, height } = Dimensions.get('window');
  return clamp(Math.min(width, height) / guidelineBaseWidth);
};

const getHeightFactor = () => {
  const { width, height } = Dimensions.get('window');
  return clamp(Math.max(width, height) / guidelineBaseHeight);
};

const scale = size => getWidthFactor() * size;
const verticalScale = size => getHeightFactor() * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale};
