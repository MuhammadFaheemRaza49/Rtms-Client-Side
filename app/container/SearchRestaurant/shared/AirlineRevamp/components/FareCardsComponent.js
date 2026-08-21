import React, {useContext, useRef} from 'react';
import {Context} from '../../../../../config/LanguageProvider';
import {Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Block from '../../../../components/Block';
import TextElement from '../../../../ComponentsV2/text/Text';
import {
  Briefcase,
  CalendarSearch,
  Circle,
  CircleCheck,
  CircleX,
  Luggage,
} from 'lucide-react-native';
import {Color, Constants} from '../../../../../common';
import appStyle from '../../PCBTicketing/styles';
import Images from '../../../../../common/Images';
import NewPriceComponent from '../../../../components/text/NewPriceComponent';
import {scale} from '../../../../../ScalingUtils';
import globals from '../../../../../../globals';
import FareCardShimmer from '../../AirlineV2/components/FareCardShimmer';
import ButtonComponent from '../../../../ComponentsV2/button/ButtonComponent';
import {useSelector} from 'react-redux';
import LucidIconWithText from '../../HotelRevamp/components/LucidIconWithText';

const WIDTH = Dimensions.get('window').width - 100;

export default function FareCardsComponent({
  item,
  onPressDetail,
  isError = false,
  onReload,
  onPress,
  isLoading,
  data,
  onSelect,
  selectedSequence = [],
  otherSequences = [],
  currentSequence = 0,
  isUmrah = false,
}) {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  const scrollRef = useRef(null);
  const charges = useSelector(state => state.airline.charges);

  const cashInHand =
    charges && charges.length > 0 ? charges[currentSequence]?.CashInHand : 0;



  const selectedSequenceFare =
      selectedSequence?.length > 0
          ? selectedSequence.reduce((acc, cur) => {
            return acc + (cur?.flight?.selectedFare?.BillablePrice ?? 0);
          }, 0)
          : 0;

  const remainingSequences = otherSequences?.filter(x=>x.Sequence>currentSequence+1)

  const cheapestBySequence = Object.values(
      remainingSequences.reduce((acc, seq) => {
        const key = seq.Sequence;
        const price = seq?.LowestFare?.BillablePrice ?? Infinity;

        if (price < (acc[key]?.LowestFare?.BillablePrice ?? Infinity)) {
          acc[key] = seq;
        }

        return acc;
      }, {})
  );


  const cheapestUnselectedFare = cheapestBySequence.reduce(
      (acc, seq) => acc + (seq?.LowestFare?.BillablePrice ?? 0),
      0
  );

  const additionalPrice =
      selectedSequenceFare +
      cheapestUnselectedFare;



  return (
    <Block isForground={true} style={{padding: 14}}>
      <TextElement h3 medium h3Style={{}}>
        {t('airline:selectYourPackage')}
      </TextElement>

      {isLoading ? (
        <ScrollView horizontal>
          <View style={[styles.row]}>
            {[1, 2, 3, 4].map((_, index) => (
              <FareCardShimmer key={index} index={index} type={1} />
            ))}
          </View>
        </ScrollView>
      ) : isError ? (
        <View
          style={{
            paddingVertical: 20,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode={'contain'}
              style={styles.image}
              source={Images.airlineV2.noResults}
              tintColor={colors.blueIconColor}
            />
            <TextElement h3 bold h3Style={{color: colors.headingText}}>
              {t('airline:noAirlineFound')}
            </TextElement>
            <TextElement
              h5
              light
              h5Style={{color: colors.greyText, textAlign: 'center'}}>
              {t('airline:noAirlineFoundDescription')}
            </TextElement>
          </View>
          <View style={{marginTop: 10}}>
            <ButtonComponent
              backgroundColor={isUmrah ? Color.umrahPrimary : undefined}
              onPress={onReload}
              style={styles.bookButton}
              title={t('airline:reload')}
            />
          </View>
        </View>
      ) : item?.Flight?.Fares?.length > 0 ? (
        <>
          {/* Fares */}
          <View style={{}}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.rowAlign, {flexGrow: 1}]}>
              {item?.Flight?.Fares.map((fare, i) => (
                <FareCard
                  isUmrah={isUmrah}
                  additionalPrice={additionalPrice ?? 0}
                  cashInHand={cashInHand}
                  key={i}
                  isSelected={
                    data?.flights?.selectedFare?.RefID === fare?.RefID
                  }
                  onPressDetail={() => {
                    onPressDetail({
                      Policies: fare.Policies,
                      BaggagePolicy: fare?.BaggagePolicy ?? null,
                    });
                  }}
                  onPress={() => {
                    onSelect({
                      flight: item?.Flight,
                      selectedFare: fare,
                    });
                    if (item?.Flight?.length) {
                      scrollRef?.current?.scrollTo({
                        x: 0,
                        animated: true,
                      });
                    }
                  }}
                  data={fare}
                />
              ))}
            </ScrollView>
            <ButtonComponent
              backgroundColor={isUmrah ? Color.umrahPrimary : undefined}
              onPress={onPress}
              style={styles.bookButton}
              title={t('airline:bookme')}
            />
          </View>
        </>
      ) : null}
    </Block>
  );
}

const FareCard = ({
  data,
  onPress,
  cashInHand = 0,
  isSelected,
  additionalPrice = 0,
  isUmrah = false,
}) => {
  // console.log("data",data);
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  const handCarry = data?.BaggagePolicy?.find(item => item.Type === 'carry');
  const checkedBaggage = data?.BaggagePolicy?.find(
    item => item.Type === 'checked',
  );
  const exchangePolicy = data?.Policies?.find(item => item.Type === 'exchange');
  const refundPolicy = data?.Policies?.find(item => item.Type === 'refund');

  const handCarryText = handCarry
    ? `${handCarry?.WeightLimit} ${handCarry?.WeightUnit} ${t(
      'airline:handCarry',
    )}`
    : t('airline:handCarryNotIncluded');
  const checkedBaggageText =
    checkedBaggage?.WeightLimit && checkedBaggage?.WeightUnit
      ? `${checkedBaggage?.WeightLimit} ${checkedBaggage?.WeightUnit} ${t(
          'airline:checked',
        )}`
      : checkedBaggage?.Description ?? t('airline:checkedNotIncluded');
  const refundPolicyText = refundPolicy
    ? `${
      refundPolicy?.Charges > 0
        ? t('airline:cancellationChargesApply')
        : t('airline:freeCancellation')
    }`
    : t('airline:cancellationNotIncluded');
  const exchangePolicyText = exchangePolicy
    ? `${
      exchangePolicy?.Charges > 0
        ? t('airline:modificationChargesApply')
        : t('airline:freeModification')
    }`
    : t('airline:modificationNotIncluded');



  let billablePrice =
    cashInHand > 0
      ? Math.max(0, data.BillablePrice - cashInHand)
      : data.BillablePrice;

  billablePrice = billablePrice + additionalPrice;
  return (
    <TouchableOpacity style={[styles.fareCardContainer]} onPress={onPress}>
      <Block
        isForground={true}
        style={{
          flex: 1,
          borderColor: isSelected
            ? isUmrah
              ? colors.umrahTextChip
              : colors.blueIconColor
            : colors.borderColor2,
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
        }}>
        <Block
          isForground={true}
          style={{
            justifyContent: 'center',
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextElement
            medium
            h5
            h5Style={{
              flex: 1,
              textAlign: 'left',
              marginEnd: 10,
              color: colors.headingText,
            }}>
            {data?.Name}
          </TextElement>
          {isSelected ? (
            <CircleCheck
              fill={isUmrah ? Color.umrahPrimary : colors.primary}
              color={Color.white}
              size={24}
            />
          ) : (
            <Circle color={Color.borderGrey} size={24} />
          )}
        </Block>
        <View
          style={[appStyle.spliter, {backgroundColor: colors.borderColor2}]}
        />
        <Block isForground={true} style={{paddingTop: 10, flex: 1}}>
          <View style={{marginVertical: 5}}>
            <LucidIconWithText
              medium={false}
              iconColor={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
              mainStyle={{marginEnd: 10, marginBottom: 5}}
              titleStyle={{
                marginStart: 5,
                color: colors.greyText,
                fontSize: 12,
              }}
              title={handCarryText}
              icon={
                <Briefcase
                  size={16}
                  strokeWidth={1}
                  color={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
                />
              }
            />
            <LucidIconWithText
              medium={false}
              iconColor={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
              mainStyle={{marginEnd: 10, marginBottom: 5}}
              titleStyle={{
                marginStart: 5,
                color: colors.greyText,
                fontSize: 12,
              }}
              title={checkedBaggageText}
              icon={
                <Luggage
                  size={16}
                  strokeWidth={1}
                  color={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
                />
              }
            />
            <LucidIconWithText
              medium={false}
              iconColor={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
              mainStyle={{marginEnd: 10, marginBottom: 5}}
              titleStyle={{
                marginStart: 5,
                color: colors.greyText,
                fontSize: 12,
              }}
              title={refundPolicyText}
              icon={
                <CircleX
                  size={16}
                  strokeWidth={1}
                  color={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
                />
              }
            />

            <LucidIconWithText
              medium={false}
              iconColor={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
              mainStyle={{marginEnd: 10, marginBottom: 5}}
              titleStyle={{
                marginStart: 5,
                color: colors.greyText,
                fontSize: 12,
              }}
              title={exchangePolicyText}
              icon={
                <CalendarSearch
                  size={16}
                  strokeWidth={1}
                  color={isUmrah ? colors.umrahTextChip : colors.blueIconColor}
                />
              }
            />
          </View>
        </Block>
        <View
          style={[appStyle.spliter, {backgroundColor: colors.borderColor2}]}
        />
        <NewPriceComponent
          primary={{color: colors.headingText}}
          currency={data?.ChargedCurrency}
          h5
          medium
          h5Style={{marginTop: 10}}
          value={billablePrice}
        />
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: colors => ({
    backgroundColor: colors.bgColorWhite,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    borderBottomWidth: 0,
  }),
  block: {borderRadius: 5},
  flexRow: {flex: 1, flexDirection: 'row'},
  recommendedText: {color: Color.primary},
  refundableText: {color: Color.greenUmrah},
  longLayoverText: {color: Color.red},
  priceToggleContainer: colors => ({
    backgroundColor: Color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  }),
  tagTextContainer: {paddingVertical: 0},
  tagText: {color: Color.greenUmrah, fontSize: scale(8)},
  priceText: {color: Color.white},
  priceDiscountText: {
    marginEnd: 5,
    marginStart: 8,
    color: Color.white,
    textDecorationLine: 'line-through',
  },
  flightsTabContainer: colors => ({
    flexGrow: 1,
    backgroundColor: Color.primary,
  }),
  bookButton: {paddingVertical: 14},
  price: {
    color: Color.blackTextPrimary,
    alignSelf: 'flex-end',
    marginEnd: 5,
    marginLeft: 0,
    fontSize: 14,
  },
  image: {
    height: undefined,
    width: 60,
    aspectRatio: 0.825,
  },
  recommendedCard: {
    borderRadius: 5,
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longLayover: {
    backgroundColor: Color.redBackgroundHighligther,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  itemTextStyle: {
    fontFamily: Constants.fontFamilyMedium,
    fontSize: scale(12),

    marginTop: 4,
  },
  fareCardContainer: {
    width: WIDTH / 1.25,
    marginEnd: 5,
    borderRadius: 8,
    paddingBottom: 5,
    marginRight: 5,
    marginVertical: 10,
  },
  discountCard: {
    backgroundColor: '#df0d3e',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    marginHorizontal: 10,
  },
  tab: {
    padding: 10,
    width: WIDTH / 2.5,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: globals.semi_bold,
    includeFontPadding: false,
    paddingRight: 10,
    marginLeft: 0,
    textDecorationLine: 'line-through',
  },
  container: {
    marginTop: 5,
    marginBottom: 5,
  },
  coinImage: {
    width: 15,
    height: 15,
    marginStart: 10,
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
  },
  tagContainer: {
    backgroundColor: Color.greenHighlighter,
    borderRadius: 5,
    padding: 6,
    borderWidth: 1,
    marginBottom: 14,
    borderColor: Color.greenUmrah,
    marginHorizontal: 10,
  },
  rowAlign: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerRowItemStyle: {
    flex: 1,
    marginVertical: 5,
    flexDirection: 'row',
  },
  refundable: {
    backgroundColor: Color.greenHighlighter,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
