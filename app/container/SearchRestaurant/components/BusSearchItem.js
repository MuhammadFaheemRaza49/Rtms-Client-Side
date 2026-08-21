import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import RowItem from './RowItem';
import TextElement from '../../ComponentsV2/text/Text';
import {Color} from '../../../common';
import {scale} from '../../../ScalingUtils';
import globals from '../../../../globals';
import React, {useContext} from 'react';
import Constants from '../../../common/Constants';
import {Context} from '../../../config/LanguageProvider';
import Block from '../../components/Block';
import moment from 'moment';
import appStyle from '../shared/PCBTicketing/styles';
import BroPriceContainer from '../../components/BroPriceContainer';
import {useSelector} from 'react-redux';
import BundlePriceContainer from '../../components/BundlePriceContainer';
import HighlightTextContainter from '../../components/HighlightTextContainter';
import NewPriceComponent from '../../ComponentsV2/text/NewPriceComponent';

const BusSearchItem = React.memo(({item, modification, onPress, index}) => {
  const {
    value: {t},
  } = useContext(Context);
  const configurationSetting = useSelector(state => state.bus.busSetting);
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);
  const {
    depDate,
    departureDate,
    date,
    time,
    available_seats,
    today_offer,
    tags = [],
    bundle = {},
  } = item;

  const {active = {}} = bundle;

  let hasReminingTime = false;
  let isSamedate;
  const female = tags?.find(tag => tag?.name?.toLowerCase() === 'female');
  try {
    isSamedate = moment(departureDate, 'YYYY-MM-DD').isSame(
      moment().format('YYYY-MM-DD'),
      'day',
    );
    const deptime = moment(time, 'HH:mm').valueOf();
    const curdate = moment().format('LLLL');
    const currenttime = moment(curdate, 'LLLL').format('HH:mm');
    const currenttime2 = moment(currenttime, 'HH:mm').valueOf();
    const timedif = (deptime - currenttime2) / (60 * 60 * 1000);

    if (timedif < 2 && isSamedate) {
      hasReminingTime = true;
    }
  } catch (e) {}
  const reminingAmount = modification?.remaining_amount ?? 0;
  const temp = item.fare - reminingAmount;
  const showModificationPrice = modification
    ? temp > 0
      ? temp
      : 0
    : item.fare;

  return (
    <Block>
      <Pressable
        key={index.toString()}
        onPress={onPress}
        style={StyleSheet.flatten([
          styles.container,
          {
            backgroundColor: colors.bgColorWhite,
            borderColor: colors.borderColor,
          },
        ])}>
        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'center',
            zIndex: 3,
            top: 2,
            left: 0,
            // position: 'absolute'
          }}>
          {bundle?.current ? (
            <BundlePriceContainer data={bundle?.current} />
          ) : null}
        </View>
        <View style={appStyle.space_between}>
          {hasReminingTime ? (
            <View
              style={[
                styles.longLayover,
                {backgroundColor: colors.bgChipError, marginLeft: 14},
              ]}>
              <TextElement h7 h7Style={{color: colors.textChipError}}>
                {t('inBus:leavingSoon')}
              </TextElement>
            </View>
          ) : (
            <View />
          )}
          <View style={appStyle.rowAlign}>
            {female ? (
              <View
                style={[
                  styles.refundable,
                  {backgroundColor: colors.pinkChipBgColor, marginRight: 8},
                ]}>
                <TextElement h7 h7Style={{color: colors.pinkChipTextColor}}>
                  {female?.description}
                </TextElement>
              </View>
            ) : null}
            {available_seats > 0 && (
              <View
                style={[
                  styles.refundable,
                  {backgroundColor: colors.bgChipSuccess},
                ]}>
                <TextElement h7 h7Style={{color: colors.textChipSuccess}}>
                  {available_seats} {t('inBus:seat_left')}
                </TextElement>
              </View>
            )}
          </View>
        </View>
        {item.segment && item.segment.length > 0 ? (
          item.segment.map(rowItem => (
            <RowItem bundle={bundle?.current} item={rowItem} />
          ))
        ) : (
          <RowItem bundle={bundle?.current} item={item} />
        )}

        <View style={[styles.row, {}]}>
          <View style={[styles.row, {flex: 1, alignItems: 'flex-end'}]}></View>

          {bundle?.active?.tickets > 0 ? (
            <View
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                marginRight: 10,
                marginBottom: 10,
              }}>
              <HighlightTextContainter
                text={`${active?.title} (${active?.tickets})`}
              />
            </View>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            // alignSelf: item?.fare_detail&&item?.fare_detail?.fare!==item.fare ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            backgroundColor: Color.primary,
            padding: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}>
          {configurationSetting &&
            configurationSetting?.subscription_detail?.is_active &&
            item?.fare_detail &&
            item?.fare_detail?.fare !== item.fare && (
              <View>
                <BroPriceContainer subDetail={item.fare_detail} />
              </View>
            )}

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            {modification ? (
              <NewPriceComponent
                h6
                medium
                h6Style={[
                  {
                    color: Color.white,
                    fontFamily: Constants.fontFamilyMediumItalic,
                    textDecorationLine: 'line-through',
                    marginHorizontal: 5,
                  },
                ]}
                currency={item.currency}
                value={item.fare}
              />
            ) : (
              item?.original_fare - item?.fare > 0 && (
                <NewPriceComponent
                  h6
                  medium
                  h6Style={[
                    {
                      color: Color.white,
                      fontFamily: Constants.fontFamilyMediumItalic,
                      textDecorationLine: 'line-through',
                      marginHorizontal: 5,
                    },
                  ]}
                  currency={item.currency}
                  value={item?.original_fare}
                />
              )
            )}

            <View style={{marginEnd: 5}}>
              <NewPriceComponent
                currency={item.currency}
                unitStyle={{marginRight: 0}}
                value={showModificationPrice}
                h3
                medium
                h3Style={StyleSheet.flatten([
                  styles.price,
                  {color: Color.white},
                ])}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Block>
  );
});

export default BusSearchItem;

const styles = StyleSheet.create({
  price: {
    color: '#000',
    alignSelf: 'flex-end',
    marginEnd: 3,
    fontFamily: Constants.fontFamilyBold,
    fontSize: scale(16),
  },
  discountCard: {
    backgroundColor: '#df0d3e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    marginHorizontal: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: scale(10),
    fontFamily: globals.semi_bold,
    includeFontPadding: false,
    paddingRight: 10,
    paddingLeft: 5,
    textDecorationLine: 'line-through',
  },
  container: {
    paddingTop: 5,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 5,
    borderWidth: 1,

    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  innerRowItemStyle: {
    flex: 1,
    marginVertical: 5,
    flexDirection: 'row',
  },
  longLayover: {
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    alignSelf: 'center',
    marginHorizontal: 5,
    width: scale(2),
    height: scale(2),
    borderRadius: scale(2),
    backgroundColor: '#dbdbdb',
  },
  coinImage: {
    width: 15,
    height: 15,
    marginHorizontal: 4,
  },
  refundable: {
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    marginRight: 14,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
