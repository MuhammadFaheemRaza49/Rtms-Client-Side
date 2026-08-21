import React, { useContext } from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import { Context } from '../../../../../config/LanguageProvider'

const Card = ({ children, style, onPress }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
        <TouchableOpacity
            disabled={!onPress}
            onPress={onPress}
            style={StyleSheet.flatten([styles.container, style, { backgroundColor: colors.lightgrey }])}>
            {children}
        </TouchableOpacity>
  )
}

export default Card
const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
    margin: 3,
    borderRadius: 10
  }
})
