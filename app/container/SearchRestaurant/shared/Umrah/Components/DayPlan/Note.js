import React from 'react';
import {View,StyleSheet} from "react-native";
import {Images} from "../../../../../../common";
import appStyle from "../../../PCBTicketing/styles";
import TextElement from "../../../../../components/text/Text";



export default function Note({textStyle,text}) {
    return(
        <View style={styles.note}>
           <TextElement style={[appStyle.black10,{textAlign:'center'},textStyle]}>{
               text
           }</TextElement>
        </View>
    )
}

const styles = StyleSheet.create({
    note:{
        justifyContent:'center',
        marginTop:10,
        backgroundColor:'rgba(55, 118, 244, 0.1)',
        paddingHorizontal:10,
        paddingVertical:8,
        borderRadius:5,
    }
})
