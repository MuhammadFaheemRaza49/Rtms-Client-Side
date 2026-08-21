import React, {useContext} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'
import Block from "../../components/Block";
import TextElement from "../../components/text/Text";
import Constants from "../../../common/Constants";
import {scale} from "../../../ScalingUtils";
import {Context} from "../../../config/LanguageProvider";
import ButtonComponent from "../../ComponentsV2/button/ButtonComponent";
import NewPriceComponent from '../../ComponentsV2/text/NewPriceComponent';

const SeatClassesBS = ({classess,bound,onPress}) => {
    const {value:{t,themeColor:{colors}}} = useContext(Context)
    return (
        <Block isForground={true}>
            <View style={{padding:10}}>
                <TextElement style={styles.favTitle}>{t("inBus:seatArrangement")}</TextElement>
            </View>

            <View style={{}}>

                <FlatList
                    ItemSeparatorComponent={()=><View style={appStyle.spliter}/>}
                    data={classess}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item,index})=>{
                        return(
                            <SeatClassItem item={item}/>
                        )

                    }}
                />

            </View>
            <ButtonComponent

                style={{ margin:10,  marginBottom:20}}
                onPress={onPress}
                title={t("bundles:gotIt")}
            />

        </Block>
    )

}
 const SeatClassItem = ({item}) => {
     const {value:{t,themeColor:{colors}}} = useContext(Context)

    return(
        <View style={{padding:10}}>
            <View style={styles.row}>
                <View style={{flex:1}}>
                    <TextElement>
                        <TextElement style={appStyle.h2}>{item.class_category}{" - "}</TextElement>
                        <TextElement style={[appStyle.grey12, {color: colors.greyText}]}>{t("airline:seat")} {item.areaSeatIds[0]} - {item.areaSeatIds[item.areaSeatIds.length-1]}</TextElement>
                    </TextElement>

                </View>

                <View style={styles.row}>
                    <TextElement style={[appStyle.grey12,{color: colors.greyText, marginHorizontal:5}]}>{t("hotel:startingFrom")}</TextElement>
                    <NewPriceComponent currency={item?.currency??"PKR"} value={item.flexiFare} style={[appStyle.primary12, {color: colors.primaryBlue}]}/>
                </View>

            </View>
            <TextElement style={[appStyle.grey10, {color: colors.greyText}]}>
                {item?.mealbox_info}
            </TextElement>
        </View>

    )
 }


export default SeatClassesBS
const styles = StyleSheet.create({
    col: {
        flexDirection: 'column',
        justifyContent: 'center',

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    seatView: {
        width: 40,
        height: 40,
        borderRadius:5,
    },
    favTitle: {
        // color: Color.blackTextPrimary,
        fontFamily: Constants.fontFamilyBold,
        includeFontPadding: false,
        fontSize: scale(16)
    },
    absoluteText: {
        position: 'absolute'
    }
})
