import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Color } from '../../../common';
import Constants from '../../../common/Constants';
import { scale } from '../../../ScalingUtils';
import PriceSlider from './PriceSlider';
import appStyle from '../shared/PCBTicketing/styles';
import StandardButton from '../shared/AuthContainer/Component/StandardButton';
import { Context } from '../../../config/LanguageProvider';
import PriceTextElement from '../../components/text/PriceTextElement';
import SliderComponent from '../shared/VisitSaudi/component/SliderComponent';
import TextElement from '../../ComponentsV2/ComponentsV2/text/Text';
import ButtonComponent from '../../ComponentsV2/ComponentsV2/button/ButtonComponent';
import ActualCheckBoxItem from '../../components/ActualCheckBoxItem';
import DashedLine from '../shared/AirlineV2/components/DashedLine';
import appStyles from '../shared/PCBTicketing/styles';
import NewPriceComponent from '../../components/text/NewPriceComponent';

const BusFilterBSComponent = ({
  priceDefault,
  price,
  currency = "PKR",
  busTypeList,
  busServiceList,
  onReset,
  onContinue,
}) => {
  const {
    value: { t, themeColor },
  } = useContext(Context);
  const colors = themeColor.colors;

  const [filterValue, setFilter] = useState(price);
  const [busTypes, setBusTypeList] = useState(busTypeList);
  const [busServices, setBusServiceList] = useState(busServiceList);
  const onChangeBusType = payload => {
    const busTypes = [...busTypeList];
    busTypes[payload].isSelected = !busTypes[payload].isSelected;
    setBusTypeList(busTypes);
  };
  const onChangeBusService = payload => {
    const services = [...busServices];
    services[payload] = {
      ...services[payload],
      isSelected: !services[payload].isSelected,
    };
    setBusServiceList(services);
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.favContainer,
        { backgroundColor: colors.bgColorWhite },
      ])}>

      <TextElement
        h4 medium h4Style={{ color: colors.headingText }}>
        {t('General:filter')}
      </TextElement>
      {priceDefault[0] !== priceDefault[1] ?
        <>
          <View style={{ marginVertical: 10 }}>
            <TextElement
              h5 medium h5Style={StyleSheet.flatten([styles.favTitle])}>
              {t('inBus:priceRange')}
            </TextElement>

            <SliderComponent
              sliderType="price"
              minValue={priceDefault[0]}
              maxValue={priceDefault[1]}
              onTouchEnd={() => { }}
              rangeValues={filterValue}
              onRheostatValUpdated={(low, high) => {
                let values = [low, high];
                setFilter(values);
              }}
            />

            <View style={appStyles.space_between}>
              <NewPriceComponent currency={currency} h6 medium h5Style={{}} value={priceDefault[0]} />
              <NewPriceComponent currency={currency} h6 medium h5Style={{}} value={priceDefault[1]} />
            </View>
          </View>

          <DashedLine
            color={Color.borderColor2}
            dashArray="5,5"
            height={1}
            width={'100%'}
          />
        </> : null}
      {Array.isArray(busTypes) && busTypes?.length > 0 ?
        <View style={{ marginTop: 20 }}>
          <TextElement
            style={StyleSheet.flatten([styles.favTitle, { color: colors.white }])}>
            {t('inBus:bus_type')}
          </TextElement>
          {busTypes?.map((item, index) => {
            return (
              <View key={index.toString()}>
                <ActualCheckBoxItem
                  title={item.title}
                  checkBoxValue={item.isSelected}
                  onPress={() => {
                    onChangeBusType(index);
                  }}
                />
              </View>
            );
          })}
        </View> : null}
      {Array.isArray(busServices) && busServices?.length > 0 ?
        <View style={{ marginTop: 20 }}>
          <TextElement
            style={StyleSheet.flatten([styles.favTitle, { color: colors.white }])}>
            {t('inBus:bus_service')}
          </TextElement>
          {busServices?.map((item, index) => {
            return (
              <View key={index.toString()}>
                <ActualCheckBoxItem
                  title={item.title}
                  checkBoxValue={item.isSelected}
                  onPress={() => {
                    onChangeBusService(index);
                  }}
                />
              </View>
            );
          })}
        </View> : null}
      <View
        style={StyleSheet.flatten([
          appStyle.space_between,
          { marginVertical: 10 },
        ])}>
        <View style={{ flex: 1 }}>
          <ButtonComponent
            onPress={() => {
              onReset();
            }}
            style={{
              paddingVertical: 14,
              backgroundColor: colors.bgColorWhite,
              borderWidth: 1,
              borderColor: Color.primary,
            }}
            textStyle={{ color: Color.primary }}
            title={t('hotel:clearAll')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ButtonComponent
            onPress={() => onContinue(filterValue, busTypes, busServices)}
            style={{ marginStart: 10 }}
            title={t('inBus:apply')}
          />
        </View>
      </View>
    </View>
  );
};

export default BusFilterBSComponent;
const styles = StyleSheet.create({
  favTitle: {
    includeFontPadding: false,
    marginBottom: 10,
  },
  favContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#ffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 20,
  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#dbdbdb',
  },
});
