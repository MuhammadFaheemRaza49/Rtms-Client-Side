import {View} from "react-native";
import React from "react";

const CircularView = ({current,style, index,color="#fff",backgroundColor="rgba(255, 255, 255, .5)"}) => {
    var selected = false
    if (current === index) {
        selected = true
    }
    return (
        <View style={[{
            height: 6,
            width: 6,
            borderRadius: 5,
            backgroundColor: selected ? color : backgroundColor,
            marginHorizontal: 5,
            marginVertical: 10,
        },style]}/>
    )
}

export default CircularView;
