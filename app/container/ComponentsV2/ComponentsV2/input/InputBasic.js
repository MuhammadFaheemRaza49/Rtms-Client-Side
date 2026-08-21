import React, { useContext } from 'react'
import { StyleSheet, TextInput, Platform, I18nManager } from 'react-native'
import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet'
import Color from '../../../../../common/Color'
import Constants from '../../../../../common/Constants'
import { Context } from '../../../config/LanguageProvider'
import { lightTheme } from '../../../common/Color'
import {padding} from "../../components/config/spacing";
import {lineHeights, sizes} from "../../components/config";
import fonts from "../../components/config/fonts";
import {useSelector} from 'react-redux';

const InputBasic = ({
  placeholderTextColor,
  style,
  multiline,
  numberOfLines=3,
  inputRef,
  isDark = true,
  ...rest
}) => {
  const { value: { themeColor: { colors: theme } } } = useContext(Context)
  const colors = isDark ? theme : lightTheme.colors;
  const isRTL = useSelector(state => state.app.languagee?.rtl)

  // Inside a gorhom sheet on Android the sheet only moves above the keyboard
  // when the focused input registers itself as the keyboard target, which
  // only BottomSheetTextInput does. iOS keeps the plain TextInput to avoid
  // changing behavior there.
  const isInsideBottomSheet = useBottomSheetInternal(true) != null
  const InputComponent =
    Platform.OS === 'android' && isInsideBottomSheet
      ? BottomSheetTextInput
      : TextInput

  return (
        <InputComponent
          {...rest}
          ref={inputRef}
          cursorColor={colors.primaryBlue}
          placeholderTextColor={
            placeholderTextColor || Color.accent
          }
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          style={[
            styles.input,
            {
              color: colors.white,
              fontFamily: Constants.fontFamilyRegular,
              textAlign:isRTL ? 'right' : 'left',
            },
            multiline && styles.inputMultiline,
            multiline && {
              height: numberOfLines * 20 + 2 * padding.base
            },
            style && style
          ]}
        />
  )
}

const styles = StyleSheet.create({
  input: {
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    textAlignVertical: 'center',
    ...fonts.regular,
    ...Platform.select({
      android: {
        textAlign: I18nManager.isRTL ? 'right' : 'left'
      },
      ios: {
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
      }
    })
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingVertical: 15,
    ...Platform.select({
      android: {
        textAlign: I18nManager.isRTL ? 'right' : 'left'
      },
      ios: {
        marginTop:10,
      }
    })
  }
})

InputBasic.defaultProps = {
  autoCapitalize: 'none',
  underlineColorAndroid: 'transparent',
  numberOfLines: 3
}

export default InputBasic
