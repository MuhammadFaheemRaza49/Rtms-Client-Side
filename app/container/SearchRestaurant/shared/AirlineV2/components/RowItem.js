import React, {useContext, useMemo} from 'react';
import {I18nManager, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Color, Images, Tools} from '../../../../../common';
import {scale} from '../../../../../ScalingUtils';
import moment from 'moment';
import SearchListingHeading from './SearchListingHeading';
import {Context} from '../../../../../config/LanguageProvider';
import globals from '../../../../../../globals';
import appStyle from '../../PCBTicketing/styles';
import TextElement from '../../../../ComponentsV2/text/Text';
import DashedLine from './DashedLine';
import IconWrapper from '../../../../ComponentsV2/IconWrapper';
import NewPriceComponent from '../../../../components/text/NewPriceComponent';
import {useSelector} from 'react-redux';

const RowItem = ({
                   item,
                   LowestFare={},
                   showPrice=0,
                   onClickTag,
                   tag=null,
                   isSummary=false,
                   showLine=false,
                   isUmrah=false,
}) => {
  const {
    value: {
      t,
      themeColor: {key, colors},
    },
  } = useContext(Context);
  const {
    DepartureAt,
    From,
    LayoversCount=0,
    To,
    ArrivalAt,
    TravelTime,
    Segments = [],
  } = item;
  const searchObj = useSelector(state => state.airline.searchObj);
  let travelTime = globals.convertMinsToHours(TravelTime);
  const segment = Segments.map(seg=>(seg.OperatingCarrier))?.reverse()

  const departure = moment(DepartureAt);
  const arrival = moment(ArrivalAt);

  const dayDifference = arrival
    .startOf('day')
    .diff(departure.startOf('day'), 'days');


  const label = dayDifference > 0 ? `+${dayDifference}` : '';
  const result = Object.values(
    segment.reduce((acc, curr) => {
      const name = curr?.name?.trim();
      if (!name) return acc;

      const key = name.toLowerCase();
      if (!acc[key]) acc[key] = name;

      return acc;
    }, {}),
  ).join(', ');

  // Usage

  const uniqueSegments = useMemo(() => {
    const seen = new Set();

    return segment?.filter(seg => {
      if (!seg?.logo) return false;

      if (seen.has(seg.logo)) {
        return false;
      }

      seen.add(seg.logo);
      return true;
    });
  }, [segment]);


  return (
    <View style={styles.container}>
      <View style={appStyle.rowAlign}>
        <View style={[styles.rowItem, {flex: isSummary ? 0.98 : 0.7}]}>
          <SearchListingHeading
            style={{color: colors.greyText}}
            title={moment(DepartureAt, "YYYY-MM-DD 'T' HH:mm:ss.000z").format(
              'hh:mm A',
            )}
            description={From?.city?.name}
            headingStyle={{color: colors.headingText}}
          />

          <View style={[styles.rowItem, {marginHorizontal: 10}]}>
            <View style={[styles.dot, {backgroundColor: colors.greyText}]} />
            <View style={{flex: 1}}>
              <DashedLine
                width={'100%'}
                height={1}
                color={colors.borderColor}
                dashArray="5,5"
              />
            </View>
            <View>
              <Image
                resizeMode={'contain'}
                source={Images.airlineV2.plane}
                style={{width: 18, height: 18}}
              />
            </View>
            <View style={{flex: 1}}>
              <DashedLine
                width={'100%'}
                height={1}
                color={colors.borderColor}
                dashArray="5,5"
              />
            </View>
            <View style={[styles.dot, {backgroundColor: colors.greyText}]} />
          </View>

          <SearchListingHeading
            label={label!==''?label:undefined}
            style={{color: colors.greyText}}
            title={moment(ArrivalAt, "YYYY-MM-DD 'T' HH:mm:ss.000z").format(
              'hh:mm A',
            )}
            description={To?.city?.name}
            headingStyle={{color: colors.headingText}}
          />
        </View>
        {isSummary ? null : (
          <View style={{flex: 0.4, alignItems: 'flex-end', marginStart: 20}}>
            <View>
              <NewPriceComponent
                currency={LowestFare?.ChargedCurrency ?? 'PKR'}
                value={showPrice}
                h4
                h4Style={{color: isUmrah ? colors.umrahTextChip : colors.blueIconColor}}
                medium
              />
              <TextElement
                h6
                light
                h6Style={{
                  color: isUmrah ? colors.umrahTextChip : colors.blueIconColor,
                  marginTop: 0,
                  textAlign: 'right',
                }}>
                {!searchObj?.TripType||searchObj?.TripType === 'one_way'
                  ? t(`airline:one_way`)
                  : searchObj?.TripType === 'return'
                  ? t(`airline:round_trip`)
                  : t('airline:entire_trip')}
              </TextElement>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.rowItem, {marginHorizontal: 0, marginTop: 10}]}>
        {uniqueSegments?.length > 0 &&
          uniqueSegments?.map((seg, index) => {
            return (
              <IconWrapper
                style={{
                  marginEnd: 0,
                  width: 20,
                  height: 20,
                  padding: 0,
                  borderRadius: 20,
                  marginStart: index === 0 ? 0 : -6,
                  zIndex: index + 1,
                  borderWidth: 1,
                  backgroundColor: colors.bgColorWhite,
                  borderColor: colors.borderColor,
                }}>
                <Image
                  key={index}
                  resizeMode="contain"
                  style={{flex: 1, borderRadius: 20}}
                  source={{
                    uri: seg?.logo + (key == 'dark' ? '?mode=dark' : ''),
                  }}
                />
              </IconWrapper>
            );
          })}

        <View style={{flex: 1, marginStart: 5}}>
          <TextElement h6 medium h6Style={{}}>
            {result}
          </TextElement>
        </View>
      </View>
      <View style={[appStyle.rowAlign, {marginBottom: 5, marginTop: 2}]}>
        <View style={{flex: 1}}>
          <TextElement h6 light h6Style={{color: colors.greyText}}>
            {travelTime} -{' '}
            {LayoversCount === 0
              ? t('airline:nonStop')
              : LayoversCount + ` ${t('airline:stopSingle')}`}
          </TextElement>
        </View>
        {tag ? (
          <TouchableOpacity onPress={onClickTag}>
            <TextElement h6 light h6Style={{color: colors.textChipSuccess}}>
              {tag?.Title}
            </TextElement>
          </TouchableOpacity>
        ) : null}
      </View>

      {showLine && (
        <View style={{marginTop: 8}}>
          <DashedLine
            width={'100%'}
            height={1}
            color={colors.borderColor2}
            dashArray="3,3"
          />
        </View>
      )}
    </View>
  );
};
export default RowItem
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        paddingTop: 10,
    },
    logo:{
        width: 40,
        height: undefined,
        aspectRatio:1,
        marginEnd: 15
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1

    },
    image: {
        width: scale(30),
        height: scale(30),
        marginHorizontal: 20
    },
    arrow_icon: {
        width: scale(35),
        aspectRatio: 2.56,
        marginHorizontal: 20
    },
    dottedLine: {
        borderBottomWidth: 1,
        borderBottomColor: Color.borderColor,
        borderStyle: 'dashed',
        width: '100%',
        marginVertical: 10,
    },

    dot:{
        height:5,
        width:5,
        borderRadius:5,
    },
    absoluteView:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top:-15,
        left:0,
        right:0,
    },
    absoluteBottom:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom:-15,
        left:0,
        right:0,
    },
  priceText: {color: Color.white},
})
