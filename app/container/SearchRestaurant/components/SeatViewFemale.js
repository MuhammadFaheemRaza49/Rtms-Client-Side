import React, {useContext, useState} from 'react'
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'
import Color from '../../../common/Color'

import store from '../../../store/configureStore'
import {scale} from "../../../ScalingUtils";
import {Images} from "../../../common";
import TextElement from "../../components/text/Text";
import {Context} from "../../../config/LanguageProvider";
const WIDTH = Dimensions.get("window").width
const SeatViewFemale = ({seat}) => {

    const {value:{themeColor:{colors}}} = useContext(Context)
    const {seat_name,premium_seat=false,label=""} = seat

    return (
        <>
            <View style={styles.col}>
                {premium_seat?
                    <Image source={Images.bus.premiumStar} style={[styles.image]}/>

                    :null}
              <Image
                source={Images.bus.seatIcon}
                style={StyleSheet.flatten([styles.seatView, {tintColor: '#EC4899'}])}
              />

                {seat_name?

                  <TextElement
                    h5
                    light
                    h5Style={StyleSheet.flatten([
                      {color: colors.greyText},
                      styles.absoluteText,
                    ])}>
                    {seat_name}
                  </TextElement>:null}

            </View>
            {label!==""?
                <TextElement style={StyleSheet.flatten([appStyle.black8,{color:colors.white}])}>{label}</TextElement>:null}
        </>

    )

}

export default SeatViewFemale
const styles = StyleSheet.create({
    col: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
  seatView: {
    width: WIDTH*0.090,
    height:undefined,
    // height: undefined,
    aspectRatio:0.74,
  },
  image: {
    position:'absolute',
    top:(-(3*0.74)/2),
    left:-2,
    zIndex:10,
    height:undefined,
    width:12,
    aspectRatio:0.93,
  },
  absoluteText: {
    position: 'absolute',
    top:(WIDTH*0.090)/2,
  }
})
