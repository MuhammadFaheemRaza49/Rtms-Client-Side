import React, {useContext} from 'react';
import {Context} from '../../../config/LanguageProvider';
import Block from '../../components/Block';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FareItem from '../../SearchRestaurant/shared/HotelRevamp/components/FareItem';
import appStyle from '../../SearchRestaurant/shared/PCBTicketing/styles';
import TextElement from '../text/Text';
import {CircleChevronUp} from 'lucide-react-native';




export default function FareSummaryComponent({
  totalFare,
  textColor = undefined,
  onViewDetails,
  currency = 'PKR',
  styles: customStyles,
  viewDetailsTitle,
}) {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  return (
    <Block
      style={[
        styles.container,
        {borderColor: colors.borderColor},
        customStyles,
      ]}
      isForground={true}>
      <FareItem
        currency={currency}
        title={t('cargo:paidAmount')}
        value={totalFare < 0 ? 0 : totalFare}
        valueStyle={{color: textColor??colors.blueIconColor}}
      />

      <TouchableOpacity
        onPress={onViewDetails}
        style={[appStyle.rowAlign, styles.fareContainer]}>
        <TextElement
          h5
          medium
          h5Style={{color: textColor??colors.blueIconColor,}}>
          {viewDetailsTitle ?? t('General:viewFareDetails')}
        </TextElement>
        <CircleChevronUp
          color={textColor??colors.blueIconColor}
          size={14}
          style={{marginStart:5}}
        />
      </TouchableOpacity>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop:10
  },
  fareContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
});
