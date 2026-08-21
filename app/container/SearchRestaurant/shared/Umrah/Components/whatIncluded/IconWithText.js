import React from 'react'
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import TextElement from "../../../../../components/text/Text";
import {Constants} from "../../../../../../common";
import homeStyle from '../../../HomeContainer/homeStyle';



const IconWithText = ({icon,iconStyle, onPress,title,titleStyle,mainStyle, iconColor}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[{flexDirection: 'row', alignItems: 'center',},mainStyle]}>
            <Image
                resizeMode={'contain'}
                style={[styles.image,iconStyle]}
                source={icon}
                tintColor={iconColor}
            />
            <View style={[homeStyle.rowHorizantalCenter,{flex:1}]}>
            <TextElement  h4 h4Style={[{fontFamily:Constants.fontFamilyMedium},titleStyle]}>
                {title}
            </TextElement>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    image: {
        height: 20,
        width: 20,
        marginEnd: 5,
      resizeMode: 'contain',
    },

})


export default IconWithText
