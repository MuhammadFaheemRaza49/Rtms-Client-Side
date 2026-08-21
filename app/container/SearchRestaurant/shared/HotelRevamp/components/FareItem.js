import React, {useContext} from 'react';
import {StyleSheet, View} from "react-native";
import TextElement from "../../../../components/text/Text";
import PriceTextElement from "../../../../components/text/PriceTextElement";
import appStyle from '../../PCBTicketing/styles'
import {scale} from "../../../../../ScalingUtils";
import {Color, Constants} from "../../../../../common";
import {Context} from "../../../../../config/LanguageProvider";
import NewPriceComponent from "../../../../ComponentsV2/text/NewPriceComponent";

const FareItem = ({title,value,titleStyle,currency='PKR',valueStyle,isMinus=false,style}) => {
    const {value: {themeColor: {colors}, t}} = useContext(Context)
  return(
      <View style={[styles.row,style]}>
          <TextElement h5 light numberOfLines={1} h5Style={[styles.titleStyle(colors),titleStyle]}>{title}</TextElement>
          <NewPriceComponent h5 medium currency={currency} isMinus={isMinus} style={[styles.valueStyle,{color: colors.headingText}, valueStyle]} value={value}/>

      </View>
  )
}
export default FareItem;

const styles=StyleSheet.create({
    row:{
        marginTop:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },

    titleStyle:(colors)=>({
        color: colors.greyText,
    }),
    valueStyle:{
        // fontSize: scale(12),
        // fontFamily: Constants.fontFamilyMedium,

    },
})
