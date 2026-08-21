import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import Color from '../../../common/Color';
import {Context} from "../../config/LanguageProvider";

const IconWrapper = ({children, style}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  return (
    <View
      style={[{
        width: 48,
        height: 52,
        padding: 5,
        borderRadius: 6,
        backgroundColor: colors.bgAnimationColor,
        justifyContent: 'center',
        marginEnd: 8
      }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});

export default IconWrapper;
