import React, { useContext } from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { Color, Constants } from '../../../../../common'
import { scale } from '../../../../../ScalingUtils'
import Images from '../../../../../common/Images'
import { Context } from '../../../../../config/LanguageProvider'
import TextElement from "../../../../ComponentsV2/text/Text";

const StayAirportTime = ({ waitTime }) => {
  const { value: { t,themeColor: { colors } } } = useContext(Context)
  return (
        <View style={StyleSheet.flatten([styles.row(colors), { }])}>
            <TextElement h6 medium h6Style={StyleSheet.flatten([ {color: colors.primaryBlue }])}>{`${t("airline:stopDuration")} ` + waitTime}</TextElement>
        </View>
  )
}

export default StayAirportTime
const styles = StyleSheet.create({
  row:(colors)=>({
    backgroundColor:colors.backgroundHighlighter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginVertical: 12,
    paddingVertical: 10
  }),
  iconStyle: {
    width: scale(10),
    height: scale(10),
    resizeMode: 'contain',
    marginEnd: 10
  },
  clockInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  h1: {
    color: '#000',
    fontSize: scale(10),
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyRegular
  },
  h2: {
    color: Color.regular_text_color,
    fontSize: scale(10),
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyRegular
  }
})
