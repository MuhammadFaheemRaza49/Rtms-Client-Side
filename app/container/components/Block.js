import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Context } from '../../config/LanguageProvider'

const Block = ({ onLayout,isDark=true,children, style, isForground = false }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)
  const backgroundColor = isDark
    ? isForground
      ? colors.bgColorWhite
      : colors.bgSecondaryColor
    : '#fff';

  return (
    <View
      onLayout={onLayout}
      style={StyleSheet.flatten([
        style,
        { backgroundColor }, // apply backgroundColor last to enforce

      ])}
    >
      {children}
    </View>
  );
};
export default Block
