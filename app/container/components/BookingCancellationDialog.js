import React, {useContext} from 'react'
import {Linking, Modal, Platform, Text, TouchableOpacity, View} from 'react-native'
import TextElement from "./text/Text";
import {Color, Constants} from "../../common";
import Block from "./Block";
import {scale} from '../../ScalingUtils'
import { AntDesign as Icon } from "@react-native-vector-icons/ant-design";
import {Context} from "../../config/LanguageProvider";

const BookingCancellationDialog = ({onPressed, isModalVisible,onPayPrevious, setModalVisibility, content }) => {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const message=content?.message
    const isWarning = content?.warning;
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisibility(isModalVisible)
                }}>
                <View style={{
                    flex: 1,
                    flexGrow: 1,
                    flexDirection: 'row',
                    backgroundColor: colors.overlay,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20
                }}>
                    <Block isForground={true} style={{
                        padding: 20,
                        width: 0,
                        flexGrow: 1,
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: 20
                    }}>

                        <TextElement
                            style={{
                                width: '100%',
                                fontFamily: Constants.fontFamilyBold,
                                fontSize: scale(14),
                                flexShrink: 1,
                                fontWeight: '400'
                            }}
                        >{'Cancel your previous booking?'}</TextElement>
                        <TextElement h6 h6Style={{color: colors.greyText,marginTop:10}}>{'You still have an unpaid previous booking. Shall we continue with the new booking?'}</TextElement>

                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: isWarning? colors.bgChipError: colors.bgSecondaryColor,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            marginTop:10,
                            marginHorizontal:5
                        }}>
                            <Icon size={16} name={isWarning?'warning':'infocirlceo'} color={isWarning? colors.textChipError: colors.primaryBlue} style={{marginTop: 3}}/>
                            <TextElement h6 h6Style={{marginStart: 10,color:isWarning? colors.textChipError:colors.blackWhite}}>{message}</TextElement>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            // justifyContent: 'space-between',
                            marginTop: 20
                        }}>
                            <TouchableOpacity
                                style={{flex:1,padding: 10,marginEnd:5,alignItems:'center',justifyContent:'center',backgroundColor: colors.bgColor,borderRadius:8}}

                                onPress={() => {
                                    onPayPrevious()
                                }}>
                                <Text style={{
                                    color: colors.primaryBlue,
                                    fontFamily: Constants.fontFamilyMedium,
                                    fontSize: scale(10
                                    )
                                }}>Pay Previous Booking</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center',padding: 10,marginStart:5,backgroundColor:colors.primaryBlue,borderRadius:8}}
                                onPress={() => {
                                    onPressed()
                                }}>
                                <Text style={{
                                    color: colors.whiteBlack,
                                    fontSize: scale(10),
                                    fontFamily: Constants.fontFamilyMedium
                                }}>Yes, Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </Block>
                </View>
            </Modal>
        </View>
    )
}

const dialCall = (number) => {
    let phoneNumber = ''

    if (Platform.OS === 'android') {
        phoneNumber = 'tel:' + number
    } else {
        phoneNumber = 'telprompt:${' + number + '}'
    }

    Linking.openURL(phoneNumber)
}
export default BookingCancellationDialog
