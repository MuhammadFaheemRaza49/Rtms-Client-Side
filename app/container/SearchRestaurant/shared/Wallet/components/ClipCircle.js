import { Text, View } from 'react-native'
import globals from '../../../../../../globals'
import React, { useContext } from 'react'
import { Context } from '../../../../../config/LanguageProvider'

const ClipCircle = ({ size, lineShow }) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  return (
    <View style={{
      flexDirection: 'row',
      flex: 1,
      height: size,
      alignItems: 'center',
      justifyContent: 'space-between',
      top: size - 80
    }}>
      <View style={{
        backgroundColor: colors.bgSecondaryColor,
        height: size,
        width: size,
        borderRadius: size / 2,
        left: -15,
      }}/>
      {lineShow ? <Text numberOfLines={1} ellipsizeMode='clip' style={{ flex: 1, color: '#939aa5', fontFamily: globals.semi_bold }}>- - - - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </Text> : null}

      <View style={{
        backgroundColor: colors.bgSecondaryColor,
        height: size,
        width: size,
        borderRadius: size / 2,
        right: -15
      }}/>
    </View>
  )
}
export default ClipCircle
