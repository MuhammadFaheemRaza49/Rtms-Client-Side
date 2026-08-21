import React, {useContext, useEffect, useState} from 'react'
import {Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'
import Color from '../../../common/Color'

import store from '../../../store/configureStore'
import { useSelector, useDispatch } from 'react-redux'
import { updateSeatCount } from '../../../redux/bus/actions'
import { scale } from '../../../ScalingUtils'
import {Images} from "../../../common";
import TextElement from "../../components/text/Text";
import {Context} from "../../../config/LanguageProvider";
const WIDTH = Dimensions.get("window").width
const SeatView = ({ seat,bound, ongetCount, onPress, selectedSeatsArray }) => {
  const {value:{themeColor:{colors}}} = useContext(Context)
  const selectedSeats = useSelector(state => state.bus.selectedSeats)
  const bus = useSelector(state => state.bus)
  // const state = store.getState()
  // const {selectedSeats} = state.bus;
  const dispatch = useDispatch()
  const [isSelected, setSelected] = useState(false)
  const { seat_name, seat_color, seat_female,premium_seat=false,label="" } = seat

  useEffect(() => {
    setSelected(selectedSeats.filter(item => item.seat_id == seat.seat_id).length > 0)
  }, [bus.selectedSeats])

  let seatStyle, textStyle
  const disabled = false
  if (bound?.selectedSeats&&bound?.selectedSeats.length>0){
    if (bound.selectedSeats.filter(item => item.seat_id == seat.seat_id).length > 0){
      seatStyle = {tintColor:"#F59E0B"}
    } else {
      seatStyle = {tintColor:colors.blueIconColor}

    }

  }else {
    if (selectedSeats.filter(item => item.seat_id == seat.seat_id).length > 0) {
      seatStyle = {tintColor:"#F59E0B"}
    } else
      seatStyle={tintColor:colors.blueIconColor}
  }

  return (
      <>
        <Pressable disabled={disabled} onPress={() => {
          onPress(seat);
        }} style={styles.col}>
          {premium_seat?
              <Image source={Images.bus.premiumStar} style={[styles.image]}/>

              :null}

          <Image
            source={Images.bus.seatIcon}
            style={StyleSheet.flatten([styles.seatView, seatStyle])}
          />

          <TextElement
            h5
            light
            h5Style={StyleSheet.flatten([{color:colors.greyText}, styles.absoluteText,{}])}>{seat_name}</TextElement>
        </Pressable>

        {label!==""?
            <TextElement style={StyleSheet.flatten([appStyle.black8,{color:colors.white}])}>{label}</TextElement>:null}
      </>

  )
}

export default SeatView
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
