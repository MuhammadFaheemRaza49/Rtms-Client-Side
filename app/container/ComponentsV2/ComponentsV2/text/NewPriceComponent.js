import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, StyleSheet, View, TextStyle, I18nManager} from 'react-native';
import Constants from '../../../../../common/Constants';
import Tools from '../../../../../common/Tools';
import {Context} from '../../../config/LanguageProvider';
import TextElement from './Text';
import {useSelector} from 'react-redux';

const NewPriceComponent = props => {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);
  const currencyObj = useSelector(state => state.app.currency);
  const {
    isMinus = false,
    isPlus = false,
    currency = 'PKR',
    style,
    unitStyle,
    containerStyle,
    children,
    medium,
    light,
    bold,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
    h1Style,
    h2Style,
    h3Style,
    h4Style,
    h5Style,
    h6Style,
    h7Style,
    colorSecondary,
    colorThird,
    primary,
    secondary,
    third,
    value = 0,
    ...rest
  } = props;
  const [calculatedValue, setCalculatedValue] = useState(value);

  useEffect(() => {
    const floatedValue = parseFloat(value);
    if (floatedValue) {
      setCalculatedValue(
        currency === 'PKR'
          ? Tools.formatNumber(floatedValue)
          :Tools.formatNumber(floatedValue?.toFixed(2))
      );
    } else {
      setCalculatedValue(0);
    }
  }, [currencyObj, value]);

  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
      <TextElement
        style={StyleSheet.flatten([
          {color: colors.white, marginLeft: 3},
          styles.text,
          StyleSheet.flatten([primary, style]),
          colorSecondary && secondary,
          colorThird && third,
          h1 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h1,
                lineHeight: Constants.lineHeights.h1,
                fontFamily: Constants.fontFamilyMedium,
              },
              h1Style,
            ]),
          h2 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h2,
                lineHeight: Constants.lineHeights.h2,
                fontFamily: Constants.fontFamilyMedium,
              },
              h2Style,
            ]),
          h3 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h3,
                lineHeight: Constants.lineHeights.h3,
                fontFamily: Constants.fontFamilyMedium,
              },
              h3Style,
            ]),
          h4 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h4,
                lineHeight: Constants.lineHeights.h4,
                fontFamily: Constants.fontFamilyMedium,
              },
              h4Style,
            ]),
          h5 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h5,
                lineHeight: Constants.lineHeights.h5,
                fontFamily: Constants.fontFamilyRegular,
              },
              h5Style,
            ]),
          h6 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h6,
                lineHeight: Constants.lineHeights.h6,
                fontFamily: Constants.fontFamilyRegular,
              },
              h6Style,
            ]),
          h7 &&
            StyleSheet.flatten([
              {
                fontSize: Constants.sizes.h7,
                lineHeight: Constants.lineHeights.h7,
                fontFamily: Constants.fontFamilyRegular,
              },
              h7Style,
            ]),
          light && styles.light,
          medium && styles.medium,
          bold && styles.bold,
        ])}
        {...rest}>
        {!I18nManager.isRTL?(isMinus ? '-' : isPlus ? '+' : ''):''}
        {currency ?? currencyObj.key} {calculatedValue}
        {I18nManager.isRTL?(isMinus ? '-' : isPlus ? '+' : ''):''}
      </TextElement>
    </View>
  );
};

NewPriceComponent.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  unitStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  medium: PropTypes.bool,
  light: PropTypes.bool,
  bold: PropTypes.bool,
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  h5: PropTypes.bool,
  h6: PropTypes.bool,
  h7: PropTypes.bool,
  colorSecondary: PropTypes.bool,
  colorThird: PropTypes.bool,
  h1Style: TextStyle,
  h2Style: TextStyle,
  h3Style: TextStyle,
  h4Style: TextStyle,
  h5Style: TextStyle,
  h6Style: TextStyle,
  h7Style: Text.TextStyle,
  primary: TextStyle,
  secondary: TextStyle,
  third: TextStyle,
  children: PropTypes.node,
  value: PropTypes.number,
};

NewPriceComponent.defaultProps = {
  medium: false,
  light: false,
  bold: false,
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  colorSecondary: false,
  colorThird: false,
  style: {},
  h1Style: {},
  h2Style: {},
  h3Style: {},
  h4Style: {},
  h5Style: {},
  h6Style: {},
  children: '',
};

const styles = StyleSheet.create({
  text: {
    fontSize: Constants.sizes.base,
    // lineHeight: lineHeights.base,
    textAlign: 'left',
    includeFontPadding: false,
  },
  light: {
    fontFamily: Constants.fontFamilyRegular,
  },
  bold: {
    fontFamily: Constants.fontFamilyBold,
  },
  medium: {
    fontFamily: Constants.fontFamilyMedium,
  },
});
export default NewPriceComponent;
