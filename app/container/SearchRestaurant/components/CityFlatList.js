import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native'
import React, {useContext, useEffect, useState} from 'react';
import {Constants} from '../../../common';
import {scale} from '../../../ScalingUtils'
import TextElement from "../../ComponentsV2/ComponentsV2/text/Text";
import {Context} from "../../../config/LanguageProvider";
import {useSelector} from "react-redux";
import NoResultComponent from "../shared/AirlineRevamp/components/NoResultComponent";
import RecentSearchComponent from '../shared/AirlineRevamp/components/RecentSearchComponent';
import {MapPin} from 'lucide-react-native';
import Block from '../../components/Block';
import moment from 'moment';

const CityModel = ({ showShowCurrent=true,cities,isSearching,onCitySelect,autoCorrect,current,onPressAutoCorrect,onCurrent, isFromClicked,onRecentSearch}) => {

    const { value: { t,themeColor: { colors } } } = useContext(Context)
    const recentSearch = useSelector(state => state.bus.recentSearch)
    const [before, after] = autoCorrect?autoCorrect?.split('?'):["",""];
    const [cityList, setCityList] = useState(cities??[])
    const hasCurrentLocation = showShowCurrent && !!current?.name && !isSearching;

    useEffect(() => {

      setCityList(cities)
    },[cities])



    return (
      <Block style={{flex: 1}}>
        <Block style={{flex: 1}}>
          {hasCurrentLocation ? (
            <View style={{paddingVertical: 10}}>
              <TextElement
                h4
                medium
                h4Style={{paddingHorizontal: 14, marginBottom: 10}}>
                {t('hotel:currentLocation')}
              </TextElement>
              <View>
                <BusItem
	                  item={{
	                    nameu: current?.name,
	                    name: current?.name,
	                    short_name: t('hotel:currentLocation'),
	                  }}
                  index={'0'}
                  onSelect={() => {
                    // ;
                    let currentCity =null;
                    if(current?.name) {
                       currentCity = cities?.find(city =>
                        city.name?.toLowerCase().includes(current.name?.toLowerCase())
                      );
                    }


                    // console.log(currentCity?.destination);

                    if (currentCity) {
                      onCitySelect(currentCity);
                    }else {
                      onCurrent(current?.name)
                    }
                  }}
                />
              </View>
            </View>
          ) : null}
          {cities?.length === 0 && autoCorrect?.length > 0 && (
            <TextElement
              onPress={() => {
                onPressAutoCorrect(after);
              }}
              style={{marginHorizontal: 10, marginTop: 14}}>
              <TextElement h5 medium h5Style={{}}>
                {before}?
              </TextElement>
              <TextElement h5 medium h5Style={{color: colors.blueIconColor}}>
                {' '}
                {after}
              </TextElement>
            </TextElement>
          )}
          {(recentSearch && typeof recentSearch === 'object' && isFromClicked && !isSearching) ? (
            <>
              <TextElement
                h4
                medium
                h4Style={{
                  padding: 10,
                  color: colors.white,
                }}>
                {t('inBus:recent_search')}
              </TextElement>
              <RecentSearchComponent
                title={`${recentSearch?.fromCity?.name} - ${recentSearch?.toCity?.name}`}
                description={`${
                  recentSearch?.isOneWay
                    ? t('inBus:one_way')
                    : t('inBus:two_way')
                } | ${moment(
                  recentSearch?.departureDate,
                  'DD MMM, YYYY',
                ).format('DD  MMM')}${
                  recentSearch?.arrivalDate
                    ? ` - ${moment(
                      recentSearch?.arrivalDate,
                        'DD MMM, YYYY',
                      ).format('DD  MMM')}`
                    : ''
                }`}
                onSelect={() => {
                  onRecentSearch(recentSearch);
                }}
              />
            </>
          ) : null}

          {cityList?.length > 0 && <TextElement
            h4
            medium
              h4Style={{
                padding: 10,
                color: colors.white,
              }}>
              {isFromClicked
                ? t('inBus:suggestedDepartures')
                : t('inBus:suggestedDestinations')}
            </TextElement>
          }

          <FlatList

            ListEmptyComponent={<NoResultComponent />}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{flexGrow:1,paddingBottom: 150}}
            extraData={cityList}
            data={cityList}
            renderItem={({item, index}) => (
              <BusItem
                colors={colors}
                index={index.toString()}
                item={item}
                onSelect={item => {
                  onCitySelect(item);
                }}
              />
            )}
            keyExtractor={item => item.id}
          />
        </Block>
      </Block>
    );
}
const BusItem = ({item, onSelect, index}) => {
    const lang = useSelector(state=>state.app.languagee?.lang)
  const { value: { t,themeColor: {
    colors } } } = useContext(Context)


    useEffect(() => {

    }, [])

    return (
        <Block isForground={true} style={{ borderBottomWidth: 1, borderTopWidth: index === '0' ? 1 : 0, borderColor: colors.borderColor,}}>
            <TouchableOpacity key={index} style={[styles.container,]} onPress={() => onSelect(item)}>
                <View style={[styles.circleContainer(colors), {backgroundColor: colors.bgInfoChip}]}>
                  <MapPin strokeWidth={1.5} size={20} color={colors.textInfoChip} />
                </View>
                <View style={{flex:1}}>
                <View style={[styles.row,{marginHorizontal:5}]}>
                    <TextElement h5 medium h5Style={StyleSheet.flatten([styles.cityName])}>{`${item.name}`}</TextElement>
                    {/*<View style={StyleSheet.flatten([styles.shortFormContainer,{borderColor:colors.borderColor}])}>*/}
                    {/*    <TextElement h7 h7Style={{color: colors.greyText}}>{item.short_name?.toUpperCase()}</TextElement>*/}
                    {/*</View>*/}
                </View>
                </View>

            </TouchableOpacity>
        </Block>
    )
}
export default CityModel

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:14,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection:'row',
        paddingVertical: 10
    },
    col: {
        flexDirection: 'column'
    }, row: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical:scale(10),
    },
    cityName: {
        flex: 1,
      flexShrink: 1
    },
    countryName: {
        fontFamily: Constants.fontFamilyRegular,
        includeFontPadding: false,
        fontSize: scale(8)
    },
    cityCode: {
        fontFamily: Constants.fontFamilyRegular,
        includeFontPadding: false,
        fontSize: scale(12)
    },
    shortFormContainer: {
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        marginEnd:10,
    },
    image: {
        height: scale(20),
        width: scale(20),
    },
    circleContainer:(colors)=>({
        padding:8,
        alignItems:'center',
        justifyContent :'center',
        borderRadius: 20,
        marginHorizontal: 10
    }),
    line:{
        alignSelf:'flex-end',
        width: '100%',
        height: 1,
    }
})
