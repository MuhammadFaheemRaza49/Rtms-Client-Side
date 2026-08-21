import React, {useContext} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Color, Images, Tools} from '../../../common';
import {scale} from '../../../ScalingUtils';
import moment from 'moment';
import TextElement from '../../ComponentsV2/ComponentsV2/text/Text';
import EarnPointsRow from '../../ComponentsV2/ComponentsV2/EarnPointsRow';
import Constants from '../../../common/Constants';
import {Context} from '../../../config/LanguageProvider';
import BundlePriceContainer from '../../components/BundlePriceContainer';
import appStyle from '../shared/PCBTicketing/styles';
import SearchListingHeading from '../shared/AirlineV2/components/SearchListingHeading';
import DashedLine from '../shared/AirlineV2/components/DashedLine';
import LucidIconWithText from '../shared/HotelRevamp/components/LucidIconWithText';
import IconWrapper from '../../ComponentsV2/ComponentsV2/IconWrapper';
import {Calendar} from 'lucide-react-native';

const RowItem = ({item, bundle = undefined}) => {
  const {
    value: {
      t,
      themeColor: {key,colors},
    },
  } = useContext(Context);



  if (!item) return null

  return (
    <View>
      <View style={styles.container}>
        {item?.advance && item?.is_advanced == 1 ? (
          <LucidIconWithText
            mainStyle={{
              marginEnd: 0,
              marginBottom: 10,
              backgroundColor: colors.backgroundHighlighter,
              padding: 5,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.blueIconColor,
            }}
            icon={
              <Calendar
                style={{marginEnd: 5}}
                size={14}
                color={colors.blueIconColor}
              />
            }
            title={item?.advance?.description}
            titleStyle={{color: colors.blueIconColor}}
          />
        ) : null}

        <View
          style={[appStyle.rowAlign, {marginHorizontal: 0, marginBottom: 10}]}>
          <View style={{flex: 1}}>
            <TextElement h6 medium>
              <TextElement h6 medium>
                {item?.service_name}
              </TextElement>
              <TextElement h6 medium h6Style={{color: colors.greyText}}>
                {' - ' + item.busname}
              </TextElement>
            </TextElement>
          </View>
          <TextElement h6 medium h6Style={{color: colors.greyText}}>
            {t('airline:departure') +
              ' - ' +
              moment(item.departureDate, 'YYYY-MM-DD').format('DD MMMM YYYY')}
          </TextElement>
        </View>
        <View
          style={[styles.rowItem, {marginVertical: 5, marginHorizontal: 0}]}>
          <IconWrapper style={{backgroundColor:'transparent'}}>
            <Image
              resizeMode="contain"
              style={{flex: 1}}
              source={{uri: item?.thumb+(key=="dark"?"?mode=dark":"")}}
            />
          </IconWrapper>

          <View style={[styles.rowItem, {flex: 1}]}>
            <View style={{flex: 0.65}}>
              <SearchListingHeading
                style={{color: colors.greyText}}
                title={moment(item.time, 'HH:mm').format('hh:mm A')}
                description={Tools.capitalize(item?.departure_city_name)}
              />
            </View>

            <View style={[styles.rowItem, {flex: 1, marginHorizontal: 5}]}>
              <View style={[styles.dot, {backgroundColor: colors.greyText}]} />
              <View style={{flex: 1}}>
                <DashedLine
                  width={'100%'}
                  height={1}
                  color={colors.borderColor2}
                  dashArray="5,5"
                />
              </View>
              <View>
                <View
                  style={[
                    styles.recommendedCard(colors),
                    {backgroundColor: colors.bgInfoChip},
                  ]}>
                  <TextElement h7 medium h7Style={{color: colors.textInfoChip}}>
                    {item?.duration}
                  </TextElement>
                </View>
              </View>
              <View style={{flex: 1}}>
                <DashedLine
                  width={'100%'}
                  height={1}
                  color={colors.borderColor2}
                  dashArray="5,5"
                />
              </View>
              <View style={[styles.dot, {backgroundColor: colors.greyText}]} />
            </View>

            <View style={{flex: 0.65, marginLeft: 5}}>
              <SearchListingHeading
                style={{color: colors.greyText}}
                title={moment(item?.arrtime, 'HH:mm').format('hh:mm A')}
                description={Tools.capitalize(item?.arrival_city_name)}
              />
            </View>
          </View>
        </View>
        <View style={{}}>
          <View style={[styles.row]}>
            {item?.loyalty_points>0?
            <EarnPointsRow points={item.loyalty_points} style={styles.innerRowItemStyle} />
            :<View style={{flex:1}}/>}
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              {item.facilities && item.facilities.length > 0 ? (
                <View style={{alignItems: 'flex-end'}}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={item.facilities}
                    keyExtractor={(item, index) => item.key}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          key={index.toString()}
                          style={{justifyContent: 'flex-end'}}>
                          <Image
                            resizeMode={'contain'}
                            style={{width:24, height:24}}
                            source={{uri: item.img}}
                            tintColor={colors.blueIconColor}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RowItem;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: undefined,
    aspectRatio: 1,
    marginEnd: 15,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  recommendedCard: colors => ({
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginVertical: 5,
    // justifyContent: 'center',
    alignItems: 'center',
  }),
  innerRowItemStyle: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5,
  },
  arrow_icon: {
    width: scale(30),
    aspectRatio: 2.56,
    marginHorizontal: 20,
  },
});
