import React, {useContext} from 'react'
import NewGorhomBS from './NewGorhomBS';
import Block from "../components/Block";
import {StyleSheet, View, Text, ScrollView, Dimensions} from "react-native";
import TextElement from "../components/text/Text";
import appStyle from "../SearchRestaurant/shared/PCBTicketing/styles";
import Constants from "../../common/Constants";
import {Context} from "../../config/LanguageProvider";
import {scale} from "../../ScalingUtils";
import globals from "../../../globals";
import Tools from "../../common/Tools";
import HTML from "react-native-render-html";
import AirlineButton from "../SearchRestaurant/shared/AirlineV2/components/AirlineButton";


const InsuranceTermsConditions = ({refRBSheetInsurance, des,onPress}) => {
    const {value: {themeColor: {colors}}} = useContext(Context)
    const systemFonts = [ Constants.fontFamilyRegular,Constants.fontFamilyMedium,Constants.fontFamilyBold]

    return (
        <NewGorhomBS
            handleStyle={{height: 0}}
            header={() => {
                return (
                    <View style={{padding: 10, paddingBottom: 0}}>
                        <View style={styles.handler}/>
                        <TextElement
                            style={[appStyle.h, {fontFamily: Constants.fontFamilyBold}]}>{'Terms & Conditions'}
                        </TextElement>
                    </View>
                )
            }}
            closeOnOverlayTap={true}
            overlayStyle={{
                backgroundColor: colors.sheetOverlay
            }}
            modalStyle={{backgroundColor: colors.lightgrey}}
            rootStyle={{zIndex: 999999, elevation: 4}}
            adjustHeight={true}
            refRBSheet={refRBSheetInsurance}>
            <Block isForground={true} style={styles.container}>
                <View style={{
                    backgroundColor: colors.bgColorWhite,
                    marginBottom: 5,
                    borderRadius: 10,
                    paddingHorizontal: 10

                }}>
                    <ScrollView>
                        {des && Tools.isHTML(des) ?
                            <HTML
                                tagsStyles={{
                                    body: {
                                        backgroundColor: colors.bgColorWhite,
                                        margin: 0, marginBottom: 0,
                                        fontFamily:Constants.fontFamilyRegular

                                    },
                                    html: {
                                        marginBottom: 0, margin: 0,
                                        backgroundColor: colors.bgColorWhite,
                                        fontFamily:Constants.fontFamilyRegular

                                    },
                                    div: {
                                        backgroundColor: colors.bgColorWhite,
                                        color: colors.white,
                                        margin: 0, marginBottom: 0,
                                        fontFamily:Constants.fontFamilyRegular

                                    },
                                    span: {
                                        backgroundColor: colors.bgColorWhite, color: colors.white,
                                        margin: 0, marginBottom: 0,
                                        fontFamily:Constants.fontFamilyRegular


                                    },
                                    p: {
                                        backgroundColor: colors.bgColorWhite,
                                        color: colors.white,
                                        margin: 0, marginBottom: 0,
                                        fontFamily:Constants.fontFamilyRegular

                                    }
                                }}
                                systemFonts={systemFonts}
                                baseStyle={{color:colors.white,backgroundColor:colors.bgColorWhite}}
                                enableCSSInlineProcessing={false}
                                source={{html: des}}
                                contentWidth={Dimensions.get('window').width}/> :
                            <TextElement style={[appStyle.black10, {flex: 1}]}>
                                {des}
                            </TextElement>
                        }

                    </ScrollView>
                    <AirlineButton
                        onPress={onPress}
                        style={{marginVertical: 5, marginHorizontal: -3}}
                        title={`Got It`}
                    />
                </View>

            </Block>


        </NewGorhomBS>
    )
}

export default InsuranceTermsConditions;

const styles = StyleSheet.create({
    handler: {
        width: '25%',
        height: 6,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 15,
        backgroundColor: '#dbdbdb'
    },
})
