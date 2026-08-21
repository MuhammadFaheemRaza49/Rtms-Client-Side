import React, {useContext, useState} from 'react';
import {Image, TouchableOpacity, View, StyleSheet, Text} from "react-native";
import {Color, Images} from "../../../../../common";
import TextElement from "../../../../components/text/Text";
import {scale} from "../../../../../ScalingUtils";
import Block from "../../../../components/Block";
import {Context} from "../../../../../config/LanguageProvider";
import {ChevronDownCircle} from "lucide-react-native";


export default function CollapsibleViewSummary({
    disabled=false,
    title,
    children,
    light = false,
    primaryColor,
}){
    const {
        value: {
            t,
            themeColor: {colors},
        },
    } = useContext(Context);
    const [isExpand,setExpand] = useState(true);

    const onHandleClick=()=>{
        setExpand(!isExpand);
    }



    // return (
    //   <View>{children}</View>
    // )
    return (
      <Block
        isForground={true}
        style={[
          {marginTop: 10, overflow: 'hidden', borderRadius: 8, marginBottom: 0},
        ]}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onHandleClick}
          style={[styles.container(isExpand, primaryColor ?? Color.primary)]}>
          <View style={{flex: 1}}>
            <TextElement
              numberOfLines={2}
              h4
              medium
              h4Style={{
                color: light ? colors.blackWhite : Color.white,
                flex: 1,
                marginEnd: 10,
              }}>
              {title}
            </TextElement>
          </View>
          {!disabled ? (
            <View
              style={{
                transform: [{rotate: isExpand ? '180deg' : '0deg'}],
              }}>
              <ChevronDownCircle
                color={light ? colors.blackWhite : Color.white}
                size={20}
                strokeWidth={1.5}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        {isExpand && <View>{children}</View>}
      </Block>
    );

}
const styles = StyleSheet.create({

    container:(isExpand, primaryColor)=>({
        borderTopStartRadius:8,
        borderTopEndRadius:8,
        borderBottomEndRadius:isExpand?0:8,
        borderBottomStartRadius:isExpand?0:8,
        padding:10,
        flexDirection: 'row',
        alignItems:'center',
        borderColor: primaryColor,
        borderWidth:1,
        backgroundColor:primaryColor,
        overflow: 'hidden'

    }),
    bordered: {
        padding:10,
        margin:10,
        marginBottom: 0,
        // borderColor: Color.borderGrey,
        // borderWidth: 1,
    },
    icon:{
        width:scale(16),
        height:scale(16),
    }
})
