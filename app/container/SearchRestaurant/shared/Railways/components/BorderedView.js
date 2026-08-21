import Block from "../../../../components/Block";
import React, {useContext} from 'react';
import {StyleSheet} from "react-native";
import {Color} from "../../../../../common";
import {Context} from '../../../../../config/LanguageProvider';

const BorderedView = ({children, style}) => {
    const {value: {themeColor: {colors}}} = useContext(Context);


  return (
    <Block
      isForground={true}
      style={[
        styles.bordered,
        {borderColor:colors.borderColor2},
        style,
      ]}>
      {children}
    </Block>
  );
};

const styles = StyleSheet.create({
    bordered:{
      borderRadius:8,borderWidth:1,
      marginHorizontal: 14, marginBottom: 10, padding: 10,
    },
})
export default BorderedView;
