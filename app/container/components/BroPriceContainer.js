import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale} from "../../ScalingUtils";
import {Images} from "../../common";
import TextElement from "./text/Text";
import {navigate} from "../../navigation/RootNavigation";
import {bookme_bro, subscriptionFlow} from "../../navigation/NavigationPath";
import PriceTextElement from "./text/PriceTextElement";
import globals from '../../../globals'
import Color from "../../common/Color";


const BroPriceContainer = ({subDetail}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigate(bookme_bro.main_stack)
            }}>

            {/*<Image*/}
            {/*    resizeMode={"contain"}*/}
            {/*    source={{uri:subDetail?.icon}}*/}
            {/*    style={styles.icon}*/}
            {/*/>*/}
            <View style={{ marginHorizontal: 5}}>
                <TextElement
                    h6
                    medium
                    h6Style={{color: "#fff"}}
                >
                    {globals.priceUnitFormat(subDetail?.fare)+ "* "+subDetail?.name}
                </TextElement>

            </View>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.bookmeBroColor,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    icon: {
        width: scale(12),
        height: scale(12),
    }
})


export default BroPriceContainer;
