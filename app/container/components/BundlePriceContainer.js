import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale} from "../../ScalingUtils";
import {Color, Images} from "../../common";
import TextElement from "./text/Text";
import {navigate} from "../../navigation/RootNavigation";
import {busBundleFlow, railwaysStack, subscriptionFlow} from "../../navigation/NavigationPath";
import {Context} from '../../config/LanguageProvider';


const BundlePriceContainer = ({data}) => {
    const {value: {themeColor: {colors}}} = useContext(Context)

    return (
        <TouchableOpacity
            onPress={() => {

                navigate(busBundleFlow.main_bundle, {
                    screen: busBundleFlow.detail_bundle,
                    params: {
                        data: data,
                        callAPI: true
                    },
                })
            }}>


            <View style={styles.container}>
                <Image
                    source={Images.bus.bundleIcon}
                    resizeMode={'cover'}
                    style={styles.icon}
                />
                <View style={[styles.innerContainer, {backgroundColor: colors.bgSecondaryColor, borderColor: colors.blueIconColor}]}>
                <TextElement h6 medium h6Style={{fontSize:scale(8),color: colors.blueIconColor}}>
                    {data?.title}
                </TextElement>
                </View>
            </View>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    container: {

        marginTop:-6,
        marginBottom:10,
        marginLeft:10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        // alignItems: "center",
        // justifyContent: "center",
        flexDirection: "row"
    },
    icon: {
        position:'absolute',
        left:0,
        top:5,
        zIndex:11,
        width: scale(22),
        height: scale(24),
    },
    innerContainer:{
        marginTop:-1,
        paddingVertical:3,
        paddingHorizontal:8,
        marginLeft:scale(16),

    }
})


export default BundlePriceContainer;
