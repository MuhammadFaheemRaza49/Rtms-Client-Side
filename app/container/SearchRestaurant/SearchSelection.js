import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  BackHandler,
  Easing,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextElement from '../components/text/Text';
import { Color } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { scale } from '../../ScalingUtils';
import Constants from '../../common/Constants';
import {
  searchRestaurants,
  getHomeListings,
  getRestaurantDetails,
  setSearchQuery,
} from '../../redux/restaurant';
import { Context } from '../../config/LanguageProvider';
import BottomSheet from '../BottomSheet/NewGorhomBS';
import NavigationPath from '../../navigation/NavigationPath';
import SelectionButton from './shared/HotelRevamp/components/SelectionButton';
import SearchCityField2 from './shared/HotelRevamp/components/SearchCityField2';
import homeStyle from './shared/HomeContainer/homeStyle';
import CalenderComponent from './components/CalenderComponent';
import { Calendar, MapPin, Minus, Plus, Search, Users, Utensils } from 'lucide-react-native';
import { setSelectedDate as setBookingDate, setGuestCount as setBookingGuestCount } from '../../redux/booking/actions';
import BackIconComponent from '../ComponentsV2/ComponentsV2/BackIconComponent';

const SUGGESTED_RESULTS_LIMIT = 5;

const FilterIcon = ({ color = Color.textPrimary, size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 10, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 6, height: 1.5, backgroundColor: color }} />
  </View>
);

const HorizontalCard = React.memo(({ item, index, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        delay: Math.min(index * 60, 400),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        delay: Math.min(index * 60, 400),
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={styles.horizontalCard}
        activeOpacity={0.85}
        onPress={onPress}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.horizontalCardImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalCardInfo}>
          <Text style={styles.horizontalCardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.horizontalCardLocation} numberOfLines={1}>
            {item.location}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.horizontalCardPriceLabel}>Starting From</Text>
            <Text style={styles.horizontalCardPrice}>
              {item.startingPrice ? `SAR ${item.startingPrice}` : 'SAR 300'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const SearchSelection = ({
  style,
  onSearch,
  onCloseEdit,
  heightOfEdit,
  fadeAnimBottom,
  isChange = false,
  onBack = undefined,
  route,
}) => {
  const {
    value: { t, themeColor: { colors } },
  } = useContext(Context);
  const modalizeRef = useRef();
  const guestsBottomSheetRef = useRef();
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const searchResults = useSelector(state => state.restaurant.searchResults);
  const trending = useSelector(state => state.restaurant.trending);
  const nearby = useSelector(state => state.restaurant.nearby);
  const available = useSelector(state => state.restaurant.available);
  const loading = useSelector(state => state.restaurant.loading);
  const recommendations = useMemo(
    () => [...(trending ?? []), ...(nearby ?? [])],
    [trending, nearby]
  );

  const reduxSelectedDate = useSelector(state => state.booking.selectedDate);
  const reduxGuestCount = useSelector(state => state.booking.guestCount);

  const [query, setValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    reduxSelectedDate ? moment(reduxSelectedDate).format('DD MMM, YYYY') : moment(new Date()).format('DD MMM, YYYY')
  );
  const [guestCount, setGuestCount] = useState(reduxGuestCount || 2);
  const [isGuestsOpen, setGuestsOpen] = useState(false);
  const [isOpenList, setList] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isAnimFinished, setIsAnimFinished] = useState(false);

  const translateAnim = useRef(new Animated.Value(0)).current;
  const animContentFade = useRef(new Animated.Value(1)).current;
  const animEditCityOp = useRef(new Animated.Value(0)).current;
  const translateFirstField = useRef(new Animated.Value(0)).current;
  const expandedHeight = useRef();
  const editFieldHeight = useRef();
  const fieldHeight = useRef();

  const animDuration = 300;

  useEffect(() => {
    dispatch(getHomeListings());
  }, [dispatch]);

  useEffect(() => {
    if (reduxSelectedDate) {
      setSelectedDate(moment(reduxSelectedDate).format('DD MMM, YYYY'));
    }
  }, [reduxSelectedDate]);

  useEffect(() => {
    if (reduxGuestCount) {
      setGuestCount(reduxGuestCount);
    }
  }, [reduxGuestCount]);

  useEffect(() => {
    if (isOpenList) {
      animateToOpenRestaurantList();
    }
  }, [isOpenList]);

  useEffect(() => {
    if (route?.params?.autoOpen) {
      navigation.setParams({ autoOpen: undefined });
      setList(true);
    }
  }, [route?.params?.autoOpen]);

  useEffect(() => {
    // Debounced — busapp filters locally and never hits the API per keystroke
    if (query && query.length >= 2) {
      const timer = setTimeout(() => {
        dispatch(searchRestaurants(query, selectedDate, guestCount));
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [query, selectedDate, guestCount]);

  useEffect(() => {
    if (!isFocused) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpenList) {
        if (query && query.length > 0) {
          setValue('');
        } else {
          animateToCloseRestaurantList();
        }
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [isOpenList, query, isFocused]);

  const calculateToValue = (
    expandedHeightRef,
    editFieldHeightRef,
    extraOffset = 35,
  ) => {
    const expanded = expandedHeightRef?.current || 176;
    const field = editFieldHeightRef?.current || 48;
    return (
      -expanded +
      field +
      extraOffset
    );
  };

  const animateToOpenRestaurantList = (immediate = false) => {
    setIsAnimFinished(false);
    const duration = immediate ? 0 : animDuration;
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: calculateToValue(expandedHeight, editFieldHeight),
        duration: duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animContentFade, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(animEditCityOp, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimFinished(true);
    });
  };

  const animateToCloseRestaurantList = () => {
    setIsAnimFinished(false);
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: animDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animContentFade, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver: true,
      }),
      Animated.timing(animEditCityOp, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setList(false);
    });
  };

  const isSearching = query && query.length >= 2;

  const displayList = useMemo(
    () => {
      if (isSearching) {
        return searchResults ?? [];
      }
      if (available && available.length > 0) {
        return available;
      }
      return [...(trending ?? []), ...(nearby ?? [])];
    },
    [isSearching, query, searchResults, available, trending, nearby],
  );

  const defaultAvailableList = useMemo(
    () => {
      if (available && available.length > 0) {
        return available;
      }
      return [...(trending ?? []), ...(nearby ?? [])];
    },
    [available, trending, nearby],
  );

  // Suggested Results (non-search state) is capped to a fixed number of rows.
  const suggestedList = useMemo(
    () => displayList.slice(0, SUGGESTED_RESULTS_LIMIT),
    [displayList],
  );

  const handleSelectRestaurant = useCallback(item => {
    if (onSearch) {
      if (fadeAnimBottom) fadeAnimBottom.setValue(0.5);
      onSearch(item);
      animateToCloseRestaurantList();
      return;
    }
    setValue(item.name);
    dispatch(setSearchQuery(item.name));
    navigation.navigate(NavigationPath.SearchResults, { query: item.name });
  }, [onSearch, fadeAnimBottom, dispatch, navigation]);

  const incrementGuests = () => {
    const nextCount = Math.min(10, guestCount + 1);
    setGuestCount(nextCount);
    dispatch(setBookingGuestCount(nextCount));
  };

  const decrementGuests = () => {
    const nextCount = Math.max(1, guestCount - 1);
    setGuestCount(nextCount);
    dispatch(setBookingGuestCount(nextCount));
  };

  const handleCardPress = item => {
    dispatch(getRestaurantDetails(item.id));
    navigation.navigate(NavigationPath.RestaurantDetails, {
      restaurantId: item.id,
    });
  };

  const renderRestaurantCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleCardPress(item)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={homeStyle.rowHorizantalCenter}>
          <Text style={styles.cardStars}>★ ★ ★ ★ ★</Text>
          <Text style={styles.cardReviews}>({item.reviewCount || '5,201'})</Text>
        </View>
        {item.startingPrice ? (
          <Text style={styles.cardPrice}>From SAR {item.startingPrice}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  ), [handleCardPress]);

  const renderSuggestedItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.suggestedItem}
      onPress={() => handleSelectRestaurant(item)}>
      <View style={styles.suggestedIconCircle}>
        <Utensils size={16} strokeWidth={2} color={Color.headerBlue} />
      </View>
      <Text style={styles.suggestedName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [handleSelectRestaurant]);

  const renderHorizontalCard = useCallback(({ item, index }) => (
    <HorizontalCard item={item} index={index} onPress={() => handleCardPress(item)} />
  ), [handleCardPress]);

  const handleNearbyPress = useCallback(() => {
    // hook up your existing "use current location" action here
  }, []);

  const suggestedListHeader = useMemo(() => (
    <>
      <Text style={styles.sectionHeader}>Current Location</Text>
      <TouchableOpacity
        style={styles.nearbyRow}
        onPress={handleNearbyPress}>
        <View style={styles.nearbyIconCircle}>
          <MapPin size={16} strokeWidth={2} color={Color.headerBlue} />
        </View>
        <View>
          <Text style={styles.nearbyTitle}>Nearby</Text>
          <Text style={styles.nearbySubtitle}>Use my Current Location</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.sectionHeader}>Suggested Results</Text>
    </>
  ), [handleNearbyPress]);

  const listHeader = useMemo(() => (
    <Text style={styles.sectionHeader}>
      {isSearching ? 'Search Results' : 'Trending Searches'}
    </Text>
  ), [isSearching]);

  const suggestedListEmpty = useMemo(() => (
    loading ? (
      <View style={styles.emptyList}>
        <ActivityIndicator size="small" color={Color.headerBlue} />
      </View>
    ) : null
  ), [loading]);

  const searchListEmpty = useMemo(() => (
    loading ? (
      <View style={styles.emptyList}>
        <ActivityIndicator size="small" color={Color.headerBlue} />
      </View>
    ) : (
      <View style={styles.emptyList}>
        <Text style={styles.emptyText}>No Restaurants Found</Text>
      </View>
    )
  ), [loading]);

  const animatedStyle1 = {
    transform: [{ translateY: translateFirstField }],
  };

  return (
    <View style={[{ flex: 1, backgroundColor: isOpenList ? Color.white : 'transparent' }, style]}>
      <View
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          if (heightOfEdit) heightOfEdit(height);
          expandedHeight.current = height;
          setHeaderHeight(height);
        }}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.topHeader,
            {
              backgroundColor: colors?.primaryBg ?? Color.headerBlue,
              transform: [{ translateY: translateAnim }],
            },
          ])}>
          <Animated.View style={{ opacity: animContentFade }}>
            <View style={[homeStyle.rowHorizantalCenter, { alignItems: 'center', marginBottom: 12, paddingHorizontal: 14 }]}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIconComponent color={Color.white} />
              </TouchableOpacity>
              <TextElement
                h3
                bold
                h3Style={{
                  color: Color.white,
                  lineHeight: 34,
                }}>
                {t('search')}
              </TextElement>
            </View>
            <View key={'SelectionView'} style={{}}>
              <View>
                <Animated.View
                  onLayout={event => {
                    fieldHeight.current = event.nativeEvent.layout.height;
                  }}
                  style={[animatedStyle1, { marginLeft: 20, marginRight: 20 }]}>
                  <SelectionButton
                    icon={<Search color={Color.white} size={20} />}
                    placeholder={t('search_placeholder')}
                    onPress={() => setList(true)}
                    title={query || undefined}
                    textStyle={{ color: Color.white }}
                  />
                </Animated.View>
              </View>
            </View>
          </Animated.View>
          {isOpenList && (
            <Animated.View
              style={{
                opacity: animEditCityOp,
                transform: [{ translateY: translateFirstField }],
                marginTop: 12,
                left: 10,
                right: 20,
                position: 'absolute',
                bottom: 18,
              }}>
              <SearchCityField2
                isFrom={true}
                icon={<Search size={18} strokeWidth={2} color={Color.white} style={{ marginStart: 10 }} />}
                placeholder={'Search Restaurants'}
                onChange={text => {
                  setValue(text);
                }}
                value={query}
                placeholderTextColor={Color.white}
                onClear={() => {
                  setValue('');
                }}
                onBack={() => {
                  if (query && query.length > 0) {
                    setValue('');
                  } else {
                    animateToCloseRestaurantList();
                  }
                }}
                onSubmitEditing={() => {
                  if (query && query.trim().length >= 2) {
                    dispatch(setSearchQuery(query));
                    navigation.navigate(NavigationPath.SearchResults, { query: query });
                  }
                }}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
      {onSearch === undefined ? (
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: translateAnim }],
            opacity: animContentFade,
          }}>
          <FlatList
            data={defaultAvailableList}
            renderItem={renderRestaurantCard}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
            }
            ListHeaderComponent={
              <TextElement
                h4
                medium
                h4Style={{
                  paddingHorizontal: 6,
                  marginTop: 18,
                  marginBottom: 10,
                  color: Color.slate800,
                  fontSize: 16,
                  fontFamily: Constants.fontFamilyMedium,
                }}>
                Available Restaurants
              </TextElement>
            }
            numColumns={2}
            columnWrapperStyle={styles.cardColumn}
            contentContainerStyle={styles.cardGrid}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            ListEmptyComponent={
              loading ? (
                <View style={styles.emptyList}>
                  <ActivityIndicator size="small" color={Color.headerBlue} />
                </View>
              ) : (
                <View style={styles.emptyList}>
                  <Text style={styles.emptyText}>No Restaurants Found</Text>
                </View>
              )
            }
          />
        </Animated.View>
      ) : null}
      <View
        style={{ position: 'absolute', zIndex: -11, left: 10, right: 15 }}
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          editFieldHeight.current = height;
        }}>
        <SearchCityField2
          editable={false}
          isFrom={false}
          placeholder={'Search Restaurants'}
        />
      </View>
      {isOpenList ? (
        <Animated.View
          style={{
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -250,
            top: headerHeight,
            backgroundColor: Color.white,
            transform: [{ translateY: translateAnim }],
            opacity: animEditCityOp,
          }}>
          <FlatList
            style={{ flex: 1, backgroundColor: Color.white }}
            data={isAnimFinished ? (isSearching ? searchResults : displayList) : []}
            renderItem={renderHorizontalCard}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.listContent, { flexGrow: 1, paddingBottom: insets.bottom + 270 }]}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={3}
            removeClippedSubviews={true}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={isSearching ? searchListEmpty : suggestedListEmpty}
          />
        </Animated.View>
      ) : isChange ? (
        <View style={{ height: '100%', zIndex: 10000 }}>
          <Animated.View style={{ opacity: fadeAnimBottom }}>
            <TouchableOpacity
              onPress={() => {
                onCloseEdit();
              }}
              style={{
                backgroundColor: 'black',
                height: '100%',
              }} />
          </Animated.View>
        </View>
      ) : null}

      <BottomSheet isBottomSafeArea={true} refRBSheet={modalizeRef} adjustHeight={false} modalHeight={530}>
        <CalenderComponent
          isBus={false}
          oneWay={1}
          departureDate={selectedDate}
          selectedDate={depDate => {
            setSelectedDate(depDate);
            const formattedDate = moment(depDate, 'DD MMM, YYYY').format('YYYY-MM-DD');
            dispatch(setBookingDate(formattedDate));
            modalizeRef.current?.close();
          }}
        />
      </BottomSheet>

      <BottomSheet isBottomSafeArea={false} refRBSheet={guestsBottomSheetRef} adjustHeight={false} modalHeight={250}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Select No. of Guests</Text>
          <View style={styles.sheetRow}>
            <Text style={styles.sheetLabel}>Guests</Text>
            <View style={styles.sheetStepper}>
              <TouchableOpacity
                style={styles.sheetStepperBtn}
                onPress={decrementGuests}>
                <Minus size={16} strokeWidth={2.5} color={Color.greyText} />
              </TouchableOpacity>
              <Text style={styles.sheetStepperVal}>{guestCount}</Text>
              <TouchableOpacity
                style={styles.sheetStepperBtn}
                onPress={incrementGuests}>
                <Plus size={16} strokeWidth={2.5} color={Color.greyText} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sheetNextBtn}
            onPress={() => guestsBottomSheetRef.current?.close()}>
            <Text style={styles.sheetNextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

export default SearchSelection;

const styles = StyleSheet.create({
  topHeader: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    paddingBottom: 24,
  },
  guestsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: Color.textSecondary,
    fontSize: 14,
  },
  cardGrid: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  cardColumn: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48.5%',
    backgroundColor: Color.white,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Color.borderGrey,
  },
  cardImage: {
    width: '100%',
    height: 110,
  },
  cardInfo: {
    padding: 10,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: Color.textPrimary,
    lineHeight: 17,
    minHeight: 34,
  },
  cardLocation: {
    fontSize: 11,
    color: Color.textSecondary,
    marginTop: 2,
    minHeight: 14,
  },
  cardStars: {
    fontSize: 10,
    color: Color.starColor,
    marginTop: 4,
  },
  cardReviews: {
    fontSize: 9,
    color: Color.textSecondary,
    marginLeft: 4,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Color.textPrimary,
    marginTop: 6,
  },
  searchHereWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  searchHereIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Color.lightBlue100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchHereTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Color.textPrimary,
    marginBottom: 6,
  },
  searchHereSubtitle: {
    fontSize: 13,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: scale(14),
    fontFamily: Constants.fontFamilyMedium,
    color: Color.textPrimary,
    marginBottom: 2,
  },
  restaurantLocation: {
    fontSize: scale(12),
    fontFamily: Constants.fontFamilyRegular,
    color: Color.textMuted,
    marginBottom: 4,
  },
  starText: {
    fontSize: 12,
    color: Color.starColor,
  },
  reviewCount: {
    fontSize: 10,
    fontFamily: Constants.fontFamilyRegular,
    color: Color.textMuted,
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: Constants.fontFamilyBold,
    color: Color.slate800,
    fontWeight: '700',
    backgroundColor: Color.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  nearbyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.lightBlue100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nearbyTitle: {
    fontSize: 14,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.textPrimary,
  },
  nearbySubtitle: {
    fontSize: 11,
    fontFamily: Constants.fontFamilyRegular,
    color: Color.textSecondary,
    marginTop: 2,
  },
  suggestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  suggestedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.lightBlue100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestedName: {
    fontSize: 14,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.textPrimary,
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  foundTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.textPrimary,
  },
  spinner: {
    marginLeft: 8,
  },
  filterButton: {
    width: 36,
    height: 36,
    backgroundColor: Color.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Color.borderGrey,
    alignItems: 'center',
  },
  horizontalCardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  horizontalCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  horizontalCardName: {
    fontSize: 15,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.slate800,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  horizontalCardLocation: {
    fontSize: 12,
    fontFamily: Constants.fontFamilyRegular,
    color: Color.greyText,
    marginBottom: 6,
  },
  priceRow: {
    marginTop: 2,
  },
  horizontalCardPriceLabel: {
    fontSize: 11,
    fontFamily: Constants.fontFamilyRegular,
    color: Color.greyText,
  },
  horizontalCardPrice: {
    fontSize: 14,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.slate800,
    fontWeight: '700',
    marginTop: 1,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Color.white,
  },
  sheetTitle: {
    fontSize: 17,
    fontFamily: Constants.fontFamilyBold,
    fontWeight: '700',
    color: Color.slate800,
    marginBottom: 16,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetLabel: {
    fontSize: 15,
    fontFamily: Constants.fontFamilyMedium,
    color: Color.borderColor3,
    fontWeight: '500',
  },
  sheetStepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetStepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Color.borderGrey,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.gray50,
  },
  sheetStepperVal: {
    fontSize: 16,
    fontFamily: Constants.fontFamilyMedium,
    fontWeight: '600',
    color: Color.slate800,
    marginHorizontal: 16,
  },
  sheetNextBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Color.headerBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sheetNextBtnText: {
    color: Color.white,
    fontSize: 16,
    fontFamily: Constants.fontFamilyMedium,
    fontWeight: '600',
  },
});