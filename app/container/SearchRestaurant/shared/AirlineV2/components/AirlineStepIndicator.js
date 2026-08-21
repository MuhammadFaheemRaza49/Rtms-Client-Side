import React, { useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { scale } from '../../../../../ScalingUtils'
import { Constants } from '../../../../../common'
import { primary } from '../../../../../common/Color'
import { Context } from '../../../../../config/LanguageProvider'
import TextElement from "../../../../ComponentsV2/text/Text";
import appStyle  from '../../PCBTicketing/styles'

const AirlineStepIndicator = ({ step = 0, title, stepArray= [1, 2, 3, 4, 5], primaryColor }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)
  return (
        <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bgColorWhite, borderColor: colors.darkgrey }])}>
            <View style={styles.rowItem}>
                <TextElement h6 medium h6Style={StyleSheet.flatten([])}>{title}</TextElement>
            </View>
            <View style={[styles.rowItem, { marginTop: 5 }]}>
                {stepArray.map((item, index) => {
                  return (
                        <View key={index.toString()} style={[styles.line, { backgroundColor: (step - 1) > index ? primaryColor ?? colors.primaryBlue : colors.borderColor2 }]}/>
                  )
                })}
            </View>
        </View>
  )
}

export default AirlineStepIndicator

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  line: {
    flex: 1,
    height: 5,
    marginEnd: 5,
    borderRadius: 10
  },
  container: {
    paddingEnd: 9,
    paddingStart:14,
    paddingVertical: 8,


    // zIndex: 10000,
    backgroundColor: '#fff'
  },
  stepText: {
    color: '#b8b4b6',
    fontSize: scale(10),
    marginEnd: 10,
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyRegular
  },
  titleStyle: {

    fontSize: scale(10),
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyRegular
  }
})
