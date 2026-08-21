import React, { useContext } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'
import AirlineButton from '../shared/AirlineV2/components/AirlineButton'
import SelectedSeatView from './SelectedSeatView'
import { Context } from '../../../config/LanguageProvider'
import Block from '../../components/Block'
import TextElement from '../../components/text/Text'
import * as Color from '../../../common/Color'
const SelectedSeatList = ({maxSeat,isConnecting, seatList, onPress, onNext }) => {
  const { value: { t, themeColor: { colors } } } = useContext(Context)



  return (
    <Block
      isForground={true}
      style={[styles.shadow, {backgroundColor: colors.bgColorWhite}]}>
      {seatList.length > 0 && (
        <TextElement h4 medium h4Style={{color:colors.headingText}}>
          {t('inBus:selected_seats')}
        </TextElement>
      )}
      {seatList.length > 0 ? (
        <TextElement h6 h6Style={{color: colors.greyText}}>
          {t('inBus:maxSeatsText', {seatNo: maxSeat})}
        </TextElement>
      ) : (
        <View
          style={StyleSheet.flatten([
            appStyle.rowAlign,
            {width: '80%', flexWrap: 'wrap', alignSelf: 'center'},
          ])}>
          <TextElement
             h6 h6Style={{color: colors.greyText, textAlign: 'center'}}>{`Tap any available seat to select it. You can select a maximum of ${maxSeat} seats.`}</TextElement>
        </View>
      )}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {seatList.map((seat, index) => {
            return (
              <SelectedSeatView
                male={seat.gender == 'M'}
                key={index.toString()}
                onPress={() => onPress(seat)}
                seatNo={seat.seat_name}
              />
            );
          })}
        </View>
      </ScrollView>
    </Block>
  );
}

export default SelectedSeatList

const styles = StyleSheet.create({
  container: {},
  shadow: {
    padding: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  seatView: {
    width: 15,
    height: 15,
    marginVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: Color.primary
  }
})
