import React, {useContext} from 'react';
import {Image, StyleSheet, View} from "react-native";
import {Images}  from '../../../../../common'
import {Context} from "../../../../../config/LanguageProvider";
import TextElement from "../../../../ComponentsV2/text/Text";
import Block from '../../../../components/Block';




export default function NoResultComponent({tintColor=undefined,title=null, description=null}) {
    const {value} = useContext(Context);
    const {t,themeColor:{colors}} = value;

    console.log("tintColor",tintColor)
    return(
        <Block style={styles.container}>
            <Image
                resizeMode={'contain'}
                style={[styles.image,{tintColor:tintColor??colors.blueIconColor}]}
                source={Images.airlineV2.noResults}
            />
            <TextElement h3 bold h3Style={{color : colors.headingText}}>
                {title ?? t("airline:pleaseCheckYourSpellings")}
            </TextElement>
            <TextElement h5 light h5Style={{color:colors.greyText,textAlign:'center'}}>
                {description ?? t("airline:noResultDetail")}
            </TextElement>
        </Block>
    )

}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:14,
    },
    image:{
        aspectRatio:0.72,
        width:'30%',
        height:undefined
    }
})
