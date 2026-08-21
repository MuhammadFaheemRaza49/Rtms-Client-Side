import React, {memo, useCallback, useContext, useMemo} from 'react';
import {Dimensions, I18nManager, Image, LayoutAnimation, TouchableOpacity, StyleSheet, View, Pressable} from 'react-native';
import RowItem from './RowItem';
import TextElement from '../../../../ComponentsV2/text/Text';
import EarnPointsRow from '../../../../ComponentsV2/EarnPointsRow';
import {Color, Constants, Images} from '../../../../../common';
import {scale} from '../../../../../ScalingUtils';
import globals from '../../../../../../globals';
import {Context} from '../../../../../config/LanguageProvider';
import Block from '../../../../components/Block';
import appStyle from '../../PCBTicketing/styles';
import {useSelector} from 'react-redux';
import moment from 'moment/moment';

const WIDTH = Dimensions.get('window').width - 100;

const ListingItem = ({
  item,


  onClickTag,

  onLayout,
  onClickItem,
                       isRecommended=false,
  currentSequence = 0,
  selectedSequence = [],
  otherSequences = [],
  showCheapest = false,
  isUmrah = false,
}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);

  const searchObj = useSelector(state => state.airline.searchObj);
  const charges = useSelector(state => state.airline.charges);
  const isRTL = I18nManager.isRTL;
  const {LowestFare = [], RefID} = item || {};
  const LRI = '\u2066'; // Left-to-Right Isolate
  const PDI = '\u2069'; // Pop Directional Isolate
  const Tag = item?.Tags?.find(x => x.Type === 'info') ?? null;

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
  const startingFromPrice = (LowestFare?.BillablePrice ?? 0)+additionalPrice
  const temp = startingFromPrice - cashInHand;
  let showPrice = cashInHand > 0 ? (temp > 0 ? temp : 0) : startingFromPrice;

  // Highest RewardPoints this leg can earn, plus what the other legs contribute,
  // so the "Earn upto" figure lines up with the entire-trip price above.
  const legRewardPoints =
      item?.Flight?.Fares?.length > 0
          ? item.Flight.Fares.reduce(
              (max, fare) => Math.max(max, fare?.RewardPoints ?? 0),
              0,
          )
          : LowestFare?.RewardPoints ?? 0;

  const rewardPoints =
      legRewardPoints +
      (selectedSequence?.reduce(
          (acc, cur) => acc + (cur?.flight?.selectedFare?.RewardPoints ?? 0),
          0,
      ) ?? 0) +
      cheapestBySequence.reduce(
          (acc, seq) => acc + (seq?.LowestFare?.RewardPoints ?? 0),
          0,
      );

  const totalLayover = useMemo(() => {
    if (item?.Flight?.Segments?.length > 1) {
      let travelTIme = item?.Flight?.TravelTime;
      let array = item?.Flight?.Segments;
      let flightTime = array?.reduce((acc, curr) => {
        return acc + curr.FlightTime;
      }, 0);

      return travelTIme - flightTime;
    } else {
      return 0;
    }
  }, []);

  const formatDate = dateString => {
    if (!dateString) return '';
    const formatted = moment(dateString, "YYYY-MM-DD'T'HH:mm:ss.SSSZ").format(
      'DD MMMM, YYYY',
    );
    return isRTL ? `${LRI}${formatted}${PDI}` : formatted;
  };
  const finalDate = formatDate(item?.Flight?.DepartureAt);
  // console.log("showCheapest",showCheapest);
  const flightType = searchObj?.TripType === 'return' && item?.Sequence === 2
    ? t('inBus:return')
    : item?.TripNature === 'multi_city'
      ? `Flight ${item?.Sequence}`
      : t('airline:departure')


  return (
    <View style={styles.container}>
      <Pressable
        onLayout={onLayout}
        style={[
          styles.touchable(colors),
          {
            borderWidth: 1,
            borderColor:showCheapest?colors.textChipSuccess: colors.borderColor2,
          },
        ]}
        onPress={() => {
          onClickItem();
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }}>
        <Block isForground={true} style={styles.block}>
          {/* Flight Information */}
          <View style={[appStyle.rowAlign,{padding:10}]}>
            <View style={styles.flexRow}>
              <TextElement h6 medium h6Style={{color: colors.greyText}}>
                {flightType} - {finalDate}
              </TextElement>
            </View>
            <View style={appStyle.rowAlign}>
              {((isRecommended||item?.RecommendationScore >= 4) &&!showCheapest)&& (
                <View
                  style={[
                    styles.recommendedCard,
                    {
                      backgroundColor: isUmrah
                        ? colors.umrahChipBg
                        : colors.bgInfoChip,
                    },
                  ]}>
                  <TextElement
                    h7
                    medium
                    h7Style={{
                      color: isUmrah
                        ? colors.umrahTextChip
                        : colors.textInfoChip,
                    }}>
                    {t('hotel:recommended')}
                  </TextElement>
                </View>
              )}
              {totalLayover > 600 && (
                <View
                  style={[
                    styles.longLayover,
                    {
                      backgroundColor: colors.bgChipError,
                      color: colors.textChipError,
                    },
                  ]}>
                  <TextElement
                    h7
                    medium
                    h7Style={{color: colors.textChipError}}>
                    {t('airline:longLayover')}
                  </TextElement>
                </View>
              )}
            </View>
            {showCheapest?
            <View
              style={[
                styles.recommendedCard,
                {
                  backgroundColor: colors.bgChipSuccess,
                  color: colors.textInfoChip,
                },
              ]}>
              <TextElement h7 medium h7Style={{color: colors.textChipSuccess}}>
                {t('airline:cheapest')}
              </TextElement>
            </View>:null}
          </View>

          {/*Flights List*/}
          {item?.Flight ? (
            <RowItem
              key={0}
              onClickTag={onClickTag}
              tag={null}
              showPrice={showPrice}
              LowestFare={LowestFare}
              showLine={false}
              isReturn={true}
              item={item?.Flight}
            />
          ) : null}

          {/* footer: reward points (left) + Save/discount tag (right) */}
          {rewardPoints > 0 || Tag ? (
            <>
              <View
                style={[
                  appStyle.spliter,
                  {backgroundColor: colors.borderColor2, marginHorizontal: 10},
                ]}
              />
              <View style={styles.footerRow}>
                <EarnPointsRow points={rewardPoints} />
                {Tag ? (
                  <TouchableOpacity
                    onPress={onClickTag}
                    style={styles.footerTag}>
                    <TextElement
                      h6
                      medium
                      h6Style={{color: colors.textChipSuccess}}>
                      {Tag?.Title}
                    </TextElement>
                  </TouchableOpacity>
                ) : null}
              </View>
            </>
          ) : null}

          {/*tag with share link*/}
          {/*<View style={[appStyle.space_between, {marginTop: 8, marginEnd: 10}]}>*/}
          {/*  {Tag ? (*/}
          {/*    <TouchableOpacity*/}
          {/*      onPress={onClickTag}*/}
          {/*      style={[*/}
          {/*        styles.tagContainer,*/}
          {/*        {*/}
          {/*          borderColor: Color.darkGreen,*/}
          {/*          backgroundColor: colors.bgChipSuccess,*/}
          {/*        },*/}
          {/*      ]}>*/}
          {/*      <TextWithIcon*/}
          {/*        onPress={onClickTag}*/}
          {/*        iconStyle={{*/}
          {/*          width: 14,*/}
          {/*          height: 14,*/}
          {/*          tintColor: colors.textChipSuccess,*/}
          {/*        }}*/}
          {/*        containerStyle={[*/}
          {/*          styles.tagTextContainer,*/}
          {/*          {backgroundColor: colors.bgChipSuccess},*/}
          {/*        ]}*/}
          {/*        textStyle={[styles.tagText, {color: colors.textChipSuccess}]}*/}
          {/*        image={Images.visit_saudi.info}*/}
          {/*        tintColor={colors.bgChipSuccess}*/}
          {/*        title={Tag?.Title}*/}
          {/*      />*/}
          {/*    </TouchableOpacity>*/}
          {/*  ) : (*/}
          {/*    <View />*/}
          {/*  )}*/}
            {/*<TouchableOpacity*/}
            {/*  onPress={onCopyShareLink}*/}
            {/*  style={{paddingBottom: 10}}>*/}
            {/*  <SquareArrowOutUpRight*/}
            {/*    strokeWidth={1.5}*/}
            {/*    size={24}*/}
            {/*    color={colors.blueIconColor}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}


            {/*{item?.isFareChanged && (*/}
            {/*  <TextWithIcon*/}
            {/*    iconStyle={{*/}
            {/*      width: 16,*/}
            {/*      height: 16,*/}
            {/*      tintColor: Color.white,*/}
            {/*    }}*/}
            {/*    containerStyle={{paddingVertical: 0}}*/}
            {/*    textStyle={[{fontSize: 12, color: Color.white}]}*/}
            {/*    image={Images.visit_saudi.info}*/}
            {/*    tintColor={Color.white}*/}
            {/*    title={t('airline:updatedPrice')}*/}
            {/*  />*/}
            {/*)}*/}
          {/*</View>*/}


        </Block>
      </Pressable>


    </View>
  );
};




export default memo(ListingItem);

const styles = StyleSheet.create({
  touchable: colors => ({
    backgroundColor: colors.bgColorWhite,
    borderRadius: 5,
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
  fareContainer: colors => ({backgroundColor: colors.backgroundHighlighter}),
  bookButton: {marginHorizontal: 10, paddingVertical: 15, marginBottom: 10},
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
    marginStart: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longLayover: {
    backgroundColor: Color.redBackgroundHighligther,
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
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
    margin: 10,
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 8,
  },
  footerTag: {
    marginStart: 'auto',
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
    marginStart: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
