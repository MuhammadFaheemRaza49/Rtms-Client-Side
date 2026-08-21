import React, {useContext, useRef, useState} from 'react';
import {Platform, StyleSheet, View, Image, I18nManager} from 'react-native';
import Color from '../../../../../common/Color';
import Constants from '../../../../../common/Constants';
import Images from '../../../../../common/Images';
import InputBasic from "./InputBasic";
import { Feather as Icon } from "@react-native-vector-icons/feather";
import {scale} from "../../../ScalingUtils";
import TextElement from "../text/Text";
import {Context} from "../../../config/LanguageProvider";
import {margin, padding} from "../../components/config/spacing";

const MIN_HEIGHT = 53
const BOTTOM = margin.base - 6

export default function NewInputField({
                                        label,
                                        error,
                                        icon,
                                        backgroundColor,
                                        lucideIcon=undefined,
                                        imageStyle,
                                        secureTextEntry,
                                        style,
                                        multiline,
                                          placeholderTextColor=undefined,
                                        placeholder = undefined,
                                        isDark = true,
                                        maxLength = 60,
                                        editable=true,
                                        tintColor = undefined,
                                        isRequired=false,
                                        mainStyle,
                                        ...rest
                                      }) {

  const [isSecure, setSecure] = useState(secureTextEntry);
  const ref = useRef();
  const {value: {themeColor: {colors}}} = useContext(Context)

  return (
    <View>
      {
        label && <TextElement
          h5
          medium
          h5Style={{
            marginBottom: BOTTOM - 3,
            alignSelf: "flex-start",
          }}>
          {label}
        </TextElement>
      }

      <View style={[styles.viewInput,{borderColor: error?Color.red: colors.borderColor, backgroundColor: backgroundColor || colors.bgSecondaryColor},mainStyle]}>
        {icon ?
          <>
            {lucideIcon?
              (lucideIcon):
              <Image
                resizeMode={'contain'}
                source={icon}
                tintColor={tintColor ? tintColor : colors.greyText}
                style={[styles.image, imageStyle]}
              />}
          </>: null}
        <InputBasic
          editable={editable}
          {...rest}
          isDark={isDark}
          inputRef={ref}
          placeholderTextColor={placeholderTextColor??colors.greyText}
          placeholder={placeholder ?? label}
          testID="RN-text-input"
          secureTextEntry={isSecure}
          multiline={multiline}
          maxLength={maxLength}
          style={[
            editable === false && {backgroundColor:backgroundColor|| colors.bgSecondaryColor, borderRadius: 8},
            styles.input,
            !multiline && {
              height: MIN_HEIGHT,
            },
            style && style
          ]}
        />
        {error ? (


          <Image
            resizeMode={'contain'}
            style={[styles.image,{marginEnd:margin.large}]}
            source={Images.input.alert}
          />
        ):isRequired&&(
          <TextElement h6 h6Style={[{color:Color.red,marginEnd:10}]}>*</TextElement>
        )}

        {secureTextEntry && (
          <Icon
            name={isSecure ? 'eye' : 'eye-off'}
            color={isSecure ? Color.regular_text_color : colors.blueIconColor}
            size={16}
            // containerStyle={styles.viewIcon}
            style={styles.icon}
            // underlayColor="transparent"
            onPress={() =>
              setSecure(!isSecure)
            }
          />
        )}
      </View>

      {typeof error === 'string'
        ? (
          <TextElement
            style={[
              styles.textError,
              {
                color: Color.red,
              }
            ]}>
            {error}
          </TextElement>
        )
        : null}
    </View>
  )

}
const styles = StyleSheet.create({
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom:5
  },
  input: {
    flex: 1,
    paddingHorizontal: padding.small,
    fontSize: scale(12),
    paddingVertical: 10,
    fontFamily:I18nManager.isRTL?Constants.fontFamilyRegularArabic:Constants.fontFamilyRegular,
    // paddingTop: Platform.OS === 'ios' ? 10 : 14,

  },
  textError: {
    fontSize: 10,
    lineHeight: 15,
    marginBottom: BOTTOM,
    fontFamily: Constants.fontFamilyMedium
  },
  viewIcon: {
    marginRight: margin.large,
  },
  icon: {
    paddingVertical: padding.base,
    marginRight: margin.large,
  },
  image: {

    marginStart:margin.large,
    width: 18,
    height:18,
  }
});
