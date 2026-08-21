import React, { useContext } from 'react'
import {View, StyleSheet, Text, Image} from 'react-native';
import appStyle from '../shared/PCBTicketing/styles'
import Color from '../../../common/Color'
import TextElement from '../../components/text/Text'
import { Context } from '../../../config/LanguageProvider'
import {Images} from '../../../common'

const SeatTypeItem = ({ title, type }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  let seatStyle
  if (type === 'ava') {
    seatStyle = { tintColor: colors.blueIconColor }
  } else if (type === 'sel') {
    seatStyle = { tintColor: '#F59E0B',  }
  } else if (type === 'm') {
    seatStyle = { tintColor: Color.greyText2,}
  } else {
    seatStyle = { tintColor: '#EC4899',}
  }
  return (
        <View style={styles.col}>
            <Image source={Images.bus.seatIcon} style={StyleSheet.flatten([styles.seatView, seatStyle])}/>
            <TextElement h5 medium h5Style={[ { marginBottom: 5, color: colors.greyText }]}>{title}</TextElement>
        </View>
  )
}

export default SeatTypeItem
const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  seatView: {
    width: 32,
    height: 32,
    marginVertical: 5,
    resizeMode:'contain'
  }
})
