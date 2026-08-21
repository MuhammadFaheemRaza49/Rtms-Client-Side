import React, {useContext, useState} from 'react';
import Block from "../../components/Block";
import {StyleSheet, View} from "react-native";
import TextElement from "../../components/text/Text";
import appStyles from "../shared/PCBTicketing/styles"
import {Context} from "../../../config/LanguageProvider";
import AirlineButton from "../shared/AirlineV2/components/AirlineButton";
import {Color} from "../../../common";
import {TriangleAlert} from 'lucide-react-native'


function WarningSheet({onPressCancel, onPressContinue}) {
    const {value: {t, themeColor: {colors}}} = useContext(Context)


    return (
        <Block style={styles.mainContainer} isForground={true}>

            <View style={{alignItems:'center'}}>
                <TriangleAlert strokeWidth={1} style={{marginBottom: 5}} color={colors.primaryBlue} size={30}/>
            <TextElement h3 medium h3Style={{}}>
                Are you sure?
            </TextElement>
            <View style={{marginVertical:5}}>
               <TextElement style={appStyles.grey12}>
                   Changing the bus service will clear your arrival and departure fields. Are you sure you want to continue?
               </TextElement>
            </View>
            </View>

            <View style={[appStyles.rowAlign, styles.container]}>
                <View style={{flex: 1}}>
                    <AirlineButton
                        textStyle={{color: colors.primaryBlue}}
                        onPress={onPressCancel}
                        title={"Go Back"}
                        style={styles.gobackBtn(colors)}
                    />

                </View>
                <View style={{flex: 1}}>
                    <AirlineButton
                        onPress={onPressContinue}
                        style={styles.applyBtn}
                        title={"Yes"}
                    />
                </View>
            </View>

        </Block>
    )


}


const styles = StyleSheet.create({
    mainContainer:{paddingHorizontal: 20,padding:10,paddingBottom:20},
    container: {
        marginVertical: 10
    },
    clearBtnStyle: {
        marginEnd: 10,
        borderWidth: 1,
        borderColor: Color.primary,
    },
    applyBtn: {
        paddingVertical:10,
        marginStart: 10,
    },
    gobackBtn:(colors)=>({
        paddingVertical:10,
        marginEnd: 10,
        borderWidth: 1,
        borderColor: Color.primary,
        backgroundColor: colors.bgColorWhite
    })
})


export default WarningSheet;
