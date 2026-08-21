import React, { useContext } from 'react'
import { Context } from '../../config/LanguageProvider'
import { StyleSheet, View } from 'react-native'

const BlockFront = ({ children, style }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)
  return (
        <View style={StyleSheet.flatten([style])}>
            {children}
        </View>
  )
}

export default BlockFront
