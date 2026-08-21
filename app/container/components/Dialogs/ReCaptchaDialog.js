import React, {useContext, useRef, useState} from "react";
import {Image, Modal, View, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReCaptchaComponent from "../../components/ReCaptcha/src/ReCaptchaComponent";
import Block from "../Block";
import homeStyle from "../../SearchRestaurant/shared/HomeContainer/homeStyle";
import {Color, Images} from "../../../common";
import {Context} from "../../../config/LanguageProvider";
import TextElement from "../text/Text";
import Loading from "../Loading";
import { AntDesign as Icons } from "@react-native-vector-icons/ant-design";
import SafeAreaCustom from "../SafeAreaCustom";

const ReCaptchaDialog = ({isModalVisible, setVisibility, onTokenReceive}) => {
    const {value: {themeColor: {colors, key}}} = useContext(Context)
    const recaptcha = useRef();
    const [isLoading,setLoading]=useState(true)

    return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setVisibility(false)
                }}>

                {isLoading ? <Loading visible={isLoading} close={() => {
                   setLoading(false)
                }} color={Color.primary}/> : null}
                <SafeAreaView style={homeStyle.dialogBackground}>

                    <Block isForground={true} style={[homeStyle.dialogContainer,{margin:20}]}>

                        <Icons name="closecircleo" color={colors.white} size={24}
                               style={{margin: 2, alignSelf: 'flex-end'}}
                               onPress={() => {
                                   setVisibility(false)
                               }}/>

                        <View style={{
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            marginVertical: 15
                        }}>
                            <Image source={Images.auth.bookmeLogoTrans} style={styles.image}/>
                        </View>
                        <View style={{width:'100%',flexGrow:1,marginBottom:10}}>
                        <ReCaptchaComponent

                            onLoaded={(value)=>{
                                setLoading(false)
                            }}
                            size={'normal'}
                            ref={recaptcha}
                            captchaDomain={'bookme-cloud-servers.firebaseapp.com'}
                            siteKey={'6LcMZR0UAAAAALgPMcgHwga7gY5p8QMg1Hj-bmUv'}
                            onReceiveToken={(token) => {
                                onTokenReceive(token)
                            }}
                        />
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TextElement h3 medium h3Style={{textAlign: 'center'}}>{'ReCaptcha'}</TextElement>
                            <TouchableOpacity
                                style={{marginVertical: 10}}
                                onPress={() => {
                                    Linking.openURL('https://bookme.pk/terms')
                                }}>
                                <TextElement h6 light h6Style={{
                                    textAlign: 'center',
                                    color: "#111111A3",
                                }}>{'Privacy : Terms'}</TextElement>
                            </TouchableOpacity>

                        </View>

                    </Block>
                </SafeAreaView>
            </Modal>

    )
}
const styles = StyleSheet.create({
    image: {
        width: '25%',
        alignSelf: 'center',
        height: undefined,
        aspectRatio: 1
    }
})


export default ReCaptchaDialog
