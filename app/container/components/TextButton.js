import {Text, TouchableOpacity} from "react-native";
// import globals from "../../../globals";
import React from "react";
import Constants from "../../common/Constants";
import { scale } from '../../ScalingUtils'
import TextElement from "../ComponentsV2/ComponentsV2/text/Text";

export default function TextButton({title,onPress,style,containerStyle}) {

    return(
        <TouchableOpacity onPress={onPress} style={[{alignItems:'center',justifyContent:'center'},containerStyle]}>
            <TextElement style={[{fontSize:scale(12),padding:5,fontFamily:Constants.fontFamilyMedium},style]}>{title}</TextElement>
        </TouchableOpacity>
    )

}
