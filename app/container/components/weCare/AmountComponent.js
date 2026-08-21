import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {Context} from '../../../config/LanguageProvider'
import TextElement from "../text/Text";
import Block from "../Block";
import NewPriceComponent from "../../ComponentsV2/text/NewPriceComponent";

const AmountComponent = ({isPending,amount,currency="PKR"}) => {
    const {value: {language, t, themeColor: {colors}}} = useContext(Context)
  return (
        <Block  style={[styles.favContainer,]}>
            <View style={[styles.innerRowItemStyle, {flexDirection: language == 'en' ? 'row' : 'row-reverse'}]}>
                <TextElement h5 medium h5Style={{
                    color: colors.primaryWhite,
                    flex: 1,
                }}>{isPending ? t("inBus:paidAmount") : t('inBus:amountPaid')}</TextElement>
                <NewPriceComponent
                    currency={currency}
                    h5
                    medium
                    h5Style={[ {color: colors.primaryWhite, }]}
                    value={amount}
                />
            </View>

        </Block>
  )
}



const styles = StyleSheet.create({
    innerRowItemStyle: {

        paddingVertical: 5,
        marginVertical: 5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    favContainer: {
        marginVertical: 5
    },


})

export default AmountComponent
