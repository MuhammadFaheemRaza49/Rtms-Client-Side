import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../ScalingUtils';
import Color from '../../../common/Color';
import Constants from '../../../common/Constants';
import { Context } from '../../../config/LanguageProvider';
import SelectionButton from '../shared/HotelRevamp/components/SelectionButton';
import { PenLine } from 'lucide-react-native';
import BackIconComponent from '../../ComponentsV2/ComponentsV2/BackIconComponent';

const BusEditHeader = ({
  onBack,
  isOutBound,
  title,
  serviceDate,
  onClick,
  onShare,
  busObj,
}) => {
  const {
    value: {
      t,
      themeColor: { colors },
    },
  } = useContext(Context);

  return (
    <View
      style={StyleSheet.flatten([
        styles.mainContainer,
        { backgroundColor: colors.primaryBg },
      ])}>
      <View
        style={StyleSheet.flatten([
          styles.container,
          { backgroundColor: colors.verticalBgColor },
        ])}>
        <View style={styles.innerView}>
          <TouchableOpacity onPress={onBack}>
            <BackIconComponent
              size={24}
              color={'#fff'}
              style={{ marginHorizontal: 5, marginTop: 10, alignSelf: 'center' }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, marginEnd: 20 }}>
            <SelectionButton
              disable={isOutBound === 3}
              endIcon={
                <PenLine
                  color={Color.white}
                  style={{ marginEnd: 10 }}
                  size={20}
                  strokeWidth={1.5}
                />
              }
              title={`${title} | ${serviceDate}`}
              onPress={onClick}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BusEditHeader

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: Color.primary, paddingBottom: 8 },
  container: {
    marginBottom: 10,



    paddingLeft: 0,

  },
  innerView: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  textClass: {
    fontSize: scale(12),
    marginHorizontal: 10,
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  service: {
    fontSize: scale(9),
    color: Color.grey2,
    marginHorizontal: 10,
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  iconContainerStyle: {
    paddingVertical: scale(9),
    paddingHorizontal: scale(5),
    backgroundColor: 'rgba(0, 76, 146, .42)',
    alignItems: 'center',
    marginRight: scale(7),
    borderRadius: 5
  },
  imageStyle: {
    width: scale(20),
    height: scale(25),
    alignSelf: 'center'
  }
})
