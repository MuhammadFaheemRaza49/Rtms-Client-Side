import React, {useContext} from 'react';
import {View, StyleSheet, Image} from "react-native";
import IconWithText from "./IconWithText";
import {Color, Constants, Images} from "../../../../../../common";
import appStyle from "../../../PCBTicketing/styles";
import TextElement from "../../../../../components/text/Text";
import {scale} from "../../../../../../ScalingUtils";
import {Info} from "lucide-react-native";
import {Context} from '../../../../../../config/LanguageProvider';


export default function NoteComponent({iconSize=24,title="", textStyle, text,containerStyle}) {
   const {value: {themeColor: {colors}}} = useContext(Context)
    return (
        <View style={[styles.note,{backgroundColor: colors.backgroundHighlighter}]}>
            <View style={[{flexDirection: 'row'},containerStyle]}>
                <Info strokeWidth={1.5} size={iconSize} style={{marginEnd:5}} color={colors.blueIconColor}/>
                <View style={{flex: 1,}}>
                    {title!=""?
                    <TextElement h5 medium h5Style={[{ }, textStyle]}>
                        {title}
                    </TextElement>:null}
                    <TextElement h6 h6Style={[{ }, textStyle]}>
                        {text}
                    </TextElement>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: scale(20),
        width: scale(20),
        marginEnd: 10
    },
    note: {
        // justifyContent:'center',
        marginTop: 10,
        borderWidth:1,
        borderColor:Color.primary,

        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
    }
})
