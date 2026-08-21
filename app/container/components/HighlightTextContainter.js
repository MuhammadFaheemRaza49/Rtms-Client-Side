import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {scale} from "../../ScalingUtils";
import {Color} from "../../common";
import TextElement from "./text/Text";
import {Context} from "../../config/LanguageProvider";
import homeStyle from '../SearchRestaurant/shared/HomeContainer/homeStyle';



const HighlightTextContainter = ({icon=undefined,titleStyle,onPress = undefined,title=undefined, text,style,textStyle}) => {
  const {value: {t, themeColor: {colors}}} = useContext(Context)
  return (
    <TouchableOpacity
      onPress={()=>{onPress()}}
      disabled={!onPress}
      style={[styles.container(colors),style]}>
      <View style={homeStyle.rowHorizantalCenter}>
        {icon?icon:null}
        {title?
          <View style={{flexDirection:'row',alignItems:'center'}}>

            <TextElement h5 medium h5Style={[{color:colors.blueIconColor},titleStyle]}>{title}</TextElement>
          </View>
          :null}
        <TextElement h6 h6Style={[{color:colors.blueIconColor},textStyle]} light>
          {text}
        </TextElement>
      </View>

    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: (colors)=>({
    borderColor: colors.blueIconColor,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    paddingVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundHighlighter
  })


})


export default HighlightTextContainter;
