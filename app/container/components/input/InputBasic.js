import React, { useContext } from 'react'
import { StyleSheet, TextInput, Platform, I18nManager } from 'react-native'
import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet'
import fonts, { lineHeights, sizes } from '../config/fonts'
import { padding } from '../config/spacing'
import { Color, Constants } from '../../../common'
import { Context } from '../../../config/LanguageProvider'
import { lightTheme } from '../../../common/Color'

const InputBasic = ({
  placeholderTextColor,
  style,
  multiline,
  numberOfLines,
  maxLength,
  inputRef,
  isDark = true,
  ...rest
}) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

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
          placeholderTextColor={
            placeholderTextColor || Color.accent
          }
          selectionColor={colors.blueIconColor}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          style={[
            styles.input,
            {
              color: colors.greyText,
              fontFamily: Constants.fontFamilyRegular,
            },
            multiline && styles.inputMultiline,
            multiline && {
              height: numberOfLines * maxLength + 2 * padding.base
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
