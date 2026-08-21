import {StyleSheet, View} from "react-native";
import appStyle from "../SearchRestaurant/shared/PCBTicketing/styles";

import React, {useContext} from "react";
import {Color} from "../../common";
import {Context} from "../../config/LanguageProvider";
import TextElement from "./text/Text";
import ToggleSwitch from "toggle-switch-react-native";
import {useSelector} from "react-redux";
import Block from "./Block";
import NewPriceComponent from "./text/NewPriceComponent";


export default function UseWalletCard({toggle, setToggle, primaryColor=undefined,offColor=undefined}) {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const userInfo = useSelector(state => state.user.userInfo);
    if (userInfo?.user?.wcredits===0||userInfo?.user?.credits===0) return null

    return (
        <Block isForground={true} style={styles.container(colors)}>
            <TextElement medium h5 h5Style={{color: colors.greyText, marginBottom: 2}}>{t('inBus:useBookmeBal')}</TextElement>
            <View style={appStyle.rowAlign}>
                <View style={[appStyle.rowAlign, {flex: 1}]}>
                    {/*<Image source={Images.cupicon} style={styles.cupIcon}/>*/}


                    <NewPriceComponent
                        currency={userInfo?.user?.currency}
                        containerStyle={{  marginVertical: 5}}
                        value={userInfo?.user?.credits}
                        h4 medium
                    />
                </View>
                <ToggleSwitch
                    isOn={toggle}
                    onColor={primaryColor ?? colors.primary}
                    offColor={offColor??Color.blue300}
                    onToggle={isOn => setToggle(isOn)}
                />
            </View>
        </Block>
    )

}

const styles = StyleSheet.create({
    container:(colors)=>( {
        marginTop: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor:colors.borderColor,

    }),
    cupIcon: {
        width: 19,
        height: undefined,
        resizeMode: 'contain',
        aspectRatio: 1,
        marginEnd:5,
    },
})
