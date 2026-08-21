import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet } from 'react-native'
import Constants from '../../../../common/Constants'
import { Context } from '../../../../config/LanguageProvider'
import {lineHeights} from '../../../components/config/fonts';

const TextElement = props => {
  const { value: {language, themeColor: { colors } } } = useContext(Context)
  // console.log("isRTL",language);
  const {
    style,
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
    h8,
    h1Style,
    h2Style,
    h3Style,
    h4Style,
    h5Style,
    h6Style,
    h7Style,
    h8Style,
    colorSecondary,
    colorThird,
    primary,
    secondary,
    third,
    ...rest
  } = props

  const lineHeight = language==='en'?1.4:1.6
  return (
    <Text
      style={StyleSheet.flatten([
        {color: colors.headingText},
        styles.text(language),
        StyleSheet.flatten([primary, style]),
        colorSecondary && secondary,
        colorThird && third,
        h1 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h1,
              lineHeight: Constants.sizes.h1 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyMediumArabic
                  : Constants.fontFamilyMedium,
            },
            h1Style,
          ]),
        h2 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h2,
              lineHeight: Constants.sizes.h2 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyMediumArabic
                  : Constants.fontFamilyMedium,
            },
            h2Style,
          ]),
        h3 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h3,
              lineHeight: Constants.sizes.h3 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyMediumArabic
                  : Constants.fontFamilyMedium,
            },
            h3Style
          ]),
        h4 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h4,
              lineHeight: Constants.sizes.h4 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyMediumArabic
                  : Constants.fontFamilyMedium,
            },
            h4Style,
          ]),
        h5 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h5,
              lineHeight: Constants.sizes.h5 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyRegularArabic
                  : Constants.fontFamilyRegular,
            },
            h5Style,
          ]),
        h6 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h6,
              lineHeight: Constants.sizes.h6 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyRegularArabic
                  : Constants.fontFamilyRegular,
            },
            h6Style,
          ]),
        h7 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h7,
              lineHeight: Constants.sizes.h7 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyRegularArabic
                  : Constants.fontFamilyRegular,
            },
            h7Style,
          ]),
        h8 &&
          StyleSheet.flatten([
            {
              fontSize: Constants.sizes.h8,
              lineHeight: Constants.sizes.h8 * lineHeight,
              fontFamily:
                language === 'ar'
                  ? Constants.fontFamilyRegularArabic
                  : Constants.fontFamilyRegular,
            },
            h8Style,
          ]),
        light && styles.light(language),
        medium && styles.medium(language),
        bold && styles.bold(language),
      ])}
      {...rest}>
      {children}
    </Text>
  );
}

TextElement.propTypes = {
  style: Text.TextStyle,
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
  h8: PropTypes.bool,
  colorSecondary: PropTypes.bool,
  colorThird: PropTypes.bool,
  h1Style: Text.TextStyle,
  h2Style: Text.TextStyle,
  h3Style: Text.TextStyle,
  h4Style: Text.TextStyle,
  h5Style: Text.TextStyle,
  h6Style: Text.TextStyle,
  h7Style: Text.TextStyle,
  h8Style:Text.TextStyle,
  primary: Text.TextStyle,
  secondary: Text.TextStyle,
  children: PropTypes.node
}

TextElement.defaultProps = {
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
  children: ''
}

const styles = StyleSheet.create({
  text: language => ({

    textAlignVertical: 'center',
    fontSize: Constants.sizes.base,
    letterSpacing: language === 'en' ? -0.5 : 0,
    // lineHeight: lineHeights.base,
    textAlign: 'left',
    // writingDirection:language==='en'?'ltr':'rtl',
    includeFontPadding: false,
  }),
  light: language => ({
    fontFamily:
      language === 'ar'
        ? Constants.fontFamilyRegularArabic
        : Constants.fontFamilyRegular,
  }),
  bold: language => ({
    fontFamily:
      language === 'ar'
        ? Constants.fontFamilyBoldArabic
        : Constants.fontFamilyBold,
  }),
  medium: language => ({
    fontFamily:
      language === 'ar'
        ? Constants.fontFamilyMediumArabic
        : Constants.fontFamilyMedium,
  }),
});
export default TextElement
