import React, { useContext } from 'react'
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { scale } from '../../../../ScalingUtils'
import { Color, Constants } from '../../../../common'
import TextElement from '../../../components/text/Text'
import { useSelector } from "react-redux";
import { Context } from "../../../../config/LanguageProvider";
import PriceTextElement from "../../../components/text/PriceTextElement";
import NewPriceComponent from "../../../components/text/NewPriceComponent";
const ButtonOutline = ({ title, onPress, isPrice = true, value = undefined, isLoading, mainStyle = {}, style = {}, disable = false, textStyle, currency = undefined, primaryColor }) => {
  const lang = useSelector(state => state.app.languagee?.lang)
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
    <TouchableOpacity style={mainStyle} onPressIn={onPress} disabled={disable || isLoading}>
      <View
        style={[styles.row, {
          justifyContent: value ? 'space-between' : 'center',
          borderColor: primaryColor ?? colors.blueIconColor,
          backgroundColor: (disable || isLoading ? colors.darkgrey : 'transparent'),
        }, style,]}>
        {isLoading
          ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <TextElement h4 h4Style={[styles.text, { color: primaryColor ?? colors.blueIconColor }]}>Please wait....</TextElement>
            <ActivityIndicator style={styles.activityIndicator} size={'small'} color={'#fff'} />
          </View>
          : <View style={{ justifyContent: value ? 'space-between' : 'center', flexDirection: lang == 'en' ? 'row' : 'row-reverse', flex: 1 }}>
            <TextElement style={[styles.h1, { color: primaryColor ?? colors.blueIconColor }, textStyle]}>{title}</TextElement>
            {!isPrice && value ?
              <TextElement style={[styles.h1, { color: primaryColor ?? colors.blueIconColor }]}>{value}</TextElement> : null}
            {isPrice && value && value !== "" ?
              <>
                <NewPriceComponent style={[styles.h1, { color: primaryColor ?? colors.blueIconColor }]} currency={currency} value={value} />

              </> : null}
          </View>}
      </View>
    </TouchableOpacity>
  )
}

export default ButtonOutline

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,

  },
  h1: {
    fontSize: scale(14),
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  text: {
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  activityIndicator: {
    paddingHorizontal: 20
  }
})
