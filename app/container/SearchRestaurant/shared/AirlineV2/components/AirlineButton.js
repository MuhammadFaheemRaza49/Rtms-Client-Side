import React, {useContext} from 'react'
import {View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Pressable} from 'react-native'
import { scale } from '../../../../../ScalingUtils'
import { Color, Constants } from '../../../../../common'
import TextElement from '../../../../components/text/Text'
import {useSelector} from "react-redux";
import {Context} from "../../../../../config/LanguageProvider";
import PriceTextElement from "../../../../components/text/PriceTextElement";
import NewPriceComponent from "../../../../components/text/NewPriceComponent";
const AirlineButton = ({ title, onPress,isPrice=true, value = undefined, isLoading, style={backgroundColor: Color.primary}, disable = false,textStyle,currency=undefined }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
      <Pressable onPress={onPress} disabled={disable||isLoading}>
        <View
            style={[styles.row, style, {
              justifyContent: value ? 'space-between' : 'center',
              backgroundColor:style?.backgroundColor?style.backgroundColor:( disable || isLoading ? colors.darkgrey : Color.primary)
            }]}>
            {isLoading
              ? <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <TextElement h4 h4Style={[styles.text]}>Please wait....</TextElement>
                    <ActivityIndicator style={styles.activityIndicator} size={'small'} color={'#fff'}/>
                </View>
              : <View style={{ justifyContent: value ? 'space-between' : 'center', flexDirection:'row', flex: 1 }}>
                    <Text style={[styles.h1,textStyle]}>{title}</Text>
                  {!isPrice&&value?
                    <Text style={styles.h1}>{value}</Text>:null}
                  {isPrice&&value&&value!==""?
                      <>

                      {currency?

                          <NewPriceComponent style={styles.h1} currency={currency} value={value}/>:

                 <PriceTextElement style={styles.h1} value={value}/>}
                </>:null}
                </View>}
        </View>
      </Pressable>
  )
}

export default AirlineButton

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: Color.primary,
    borderRadius: 10
  },
  h1: {
    color: '#fff',
    fontSize: scale(14),
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  text: {
    color: Color.white,
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  activityIndicator: {
    paddingHorizontal: 20
  }
})
