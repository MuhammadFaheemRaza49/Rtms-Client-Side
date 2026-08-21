import {FlatList, StyleSheet, Text, TouchableOpacity, View, Animated, Easing} from 'react-native';
import React, {useContext, useEffect, useRef} from 'react';
// import globals from '../../../../globals';
import Constants from '../../../common/Constants';
// import withLanguage from '../../../config/withLanguage';
import {scale} from '../../../ScalingUtils';

import Color from '../../../common/Color';
import {Context} from '../../../config/LanguageProvider';
import {useSelector} from 'react-redux';
import NoResultComponent from '../shared/AirlineRevamp/components/NoResultComponent';
import Block from '../../components/Block';
import {BusFront, MapPin} from 'lucide-react-native';
import TextElement from '../../components/text/Text';

const ServiceFlatList = ({
  services,
  onSelectService,
  selected,
  value,
  style,
}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  useEffect(() => {
    if (services?.length>0&&!services?.find(service => service?.service_id == -1)) {
      services.splice(0, 0, {
        service_name: t("inBus:allBusService"),
        isAllService: true,
        service_id: -1,
      });
    }
  }, []);

  return (
    <View style={[{flex: 1, backgroundColor: colors.bgColor}]}>
      <View style={{flex: 1}}>
        <FlatList
          ListEmptyComponent={<NoResultComponent />}
          contentContainerStyle={{paddingBottom: 100}}
          extraData={services}
          data={services}
          renderItem={({item, index}) => (
            <BusItem
              colors={colors}
              selected={selected}
              index={index.toString()}
              item={item}
              onSelect={item => {
                onSelectService(item);
              }}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};
const BusItem = ({item, onSelect, index, selected, colors}) => {
  const lang = useSelector(state => state.app.languagee?.lang);

  useEffect(() => {}, []);

  return (
    <Block isForground={true} style={{flex: 1}}>
      <TouchableOpacity
        key={index}
        style={[
          styles.container,
          {flexDirection: lang == 'en' ? 'row' : 'row-reverse'},
        ]}
        onPress={() => onSelect(item)}>
        <View style={styles.circleContainer}>
          <BusFront strokeWidth={1.5} size={20} color={Color.primary} />
        </View>
        <View style={{flex: 1}}>
          <View
            style={[
              styles.row,
              {
                flexDirection: lang == 'en' ? 'row' : 'row-reverse',
                marginHorizontal: 5,
              },
            ]}>
            <TextElement
              h5
              medium
              h5Style={StyleSheet.flatten([
                styles.cityName,
                {color: colors.white},
              ])}>
              {item.service_name}
            </TextElement>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={StyleSheet.flatten([
          styles.line,
          {backgroundColor: colors.darkgrey},
        ])}
      />
    </Block>
  );
};
export default ServiceFlatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bebebe',
  },
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(5),
  },
  cityName: {
    flex: 1,
  },
  countryName: {
    fontFamily: Constants.fontFamilyRegular,
    includeFontPadding: false,
    color: '#b8b4b6',
    fontSize: scale(8),
  },
  circleContainer: {
    backgroundColor: Color.backgroundHighlighter,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
});
