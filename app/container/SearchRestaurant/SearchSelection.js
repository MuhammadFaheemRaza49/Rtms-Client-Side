import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  BackHandler,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextElement from '../components/text/Text';
import { Color } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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
import { Calendar, Minus, Plus, Search, Users } from 'lucide-react-native';

const SearchSelection = ({
  style,
  onSearch,
  onCloseEdit,
  heightOfEdit,
  fadeAnimBottom,
  isChange = false,
  onBack = undefined,
}) => {
  const {
    value: { t, themeColor: { colors } },
  } = useContext(Context);
  const modalizeRef = useRef();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const searchResults = useSelector(state => state.restaurant.searchResults);
  const trending = useSelector(state => state.restaurant.trending);
  const nearby = useSelector(state => state.restaurant.nearby);
  const available = useSelector(state => state.restaurant.available);
  const loading = useSelector(state => state.restaurant.loading);

  const [query, setValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('DD MMM, YYYY'),
  );
  const [guestCount, setGuestCount] = useState(2);
  const [isGuestsOpen, setGuestsOpen] = useState(false);
  const [isOpenList, setList] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

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
    if (isOpenList) {
      animateToOpenRestaurantList();
    }
  }, [isOpenList]);

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
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpenList) {
        animateToCloseRestaurantList();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [isOpenList]);

  const calculateToValue = (
    expandedHeightRef,
    editFieldHeightRef,
    extraOffset = 35,
  ) => {
    return (
      -expandedHeightRef.current +
      editFieldHeightRef.current +
      extraOffset
    );
  };

  const animateToOpenRestaurantList = () => {
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: calculateToValue(expandedHeight, editFieldHeight),
        duration: animDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animContentFade, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true,
      }),
      Animated.timing(animEditCityOp, {
        toValue: 1,
        duration: animDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateToCloseRestaurantList = () => {
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

  const handleSelectRestaurant = item => {
    if (onSearch) {
      if (fadeAnimBottom) fadeAnimBottom.setValue(0.5);
      onSearch(item);
      animateToCloseRestaurantList();
      return;
    }
    dispatch(setSearchQuery(item.name));
    dispatch(searchRestaurants(item.name, selectedDate, guestCount));
    navigation.navigate(NavigationPath.SearchResults, {query: item.name});
  };

  const incrementGuests = () =>
    setGuestCount(count => Math.min(10, count + 1));

  const decrementGuests = () =>
    setGuestCount(count => Math.max(1, count - 1));

  const handleCardPress = item => {
    dispatch(getRestaurantDetails(item.id));
    navigation.navigate(NavigationPath.RestaurantDetails, {
      restaurantId: item.id,
    });
  };

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleCardPress(item)}>
      <Image
        source={{uri: item.imageUrl}}
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
  );

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => handleSelectRestaurant(item)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantLocation}>{item.location}</Text>
        <View style={homeStyle.rowHorizantalCenter}>
          <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
          <Text style={styles.reviewCount}>({item.reviewCount || '1,123'})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const animatedStyle1 = {
    transform: [{ translateY: translateFirstField }],
  };

  return (
    <View style={style}>
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
            <View style={homeStyle.rowHorizantalCenter}>
              <TextElement
                h3
                bold
                h3Style={{
                  color: Color.white,
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
                  style={[animatedStyle1]}>
                  <SelectionButton
                    icon={<Search color={Color.white} size={20} />}
                    placeholder={t('search_placeholder')}
                    onPress={() => setList(true)}
                    title={query || undefined}
                  />
                </Animated.View>

                <SelectionButton
                  icon={<Calendar size={20} strokeWidth={2} color={Color.white} />}
                  placeholder={'Select Date'}
                  onPress={() => modalizeRef.current?.open()}
                  title={selectedDate}
                />
              </View>

              <SelectionButton
                icon={<Users size={20} strokeWidth={2} color={Color.white} />}
                placeholder={'Guests'}
                onPress={() => setGuestsOpen(open => !open)}
                title={`${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`}
              />
              {isGuestsOpen && (
                <View style={styles.guestsStepper}>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={decrementGuests}>
                    <Minus size={18} strokeWidth={2.5} color={Color.white} />
                  </TouchableOpacity>
                  <TextElement h4 h4Style={{color: Color.white}}>
                    {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                  </TextElement>
                  <TouchableOpacity
                    style={styles.stepperButton}
                    onPress={incrementGuests}>
                    <Plus size={18} strokeWidth={2.5} color={Color.white} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
          {isOpenList && (
            <Animated.View
              style={{
                opacity: animEditCityOp,
                transform: [{ translateY: translateFirstField }],
                marginTop: 10,
                left: 10,
                right: 10,
                position: 'absolute',
                bottom: 15,
              }}>
              <SearchCityField2
                isFrom={true}
                icon={<Search size={18} strokeWidth={2} color={Color.white} style={{marginStart: 10}} />}
                placeholder={'Search Restaurant'}
                onChange={text => {
                  setValue(text);
                }}
                value={query}
                onClear={() => {
                  setValue('');
                }}
                onBack={() => {
                  setValue('');
                  animateToCloseRestaurantList();
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
            transform: [{translateY: translateAnim}],
            opacity: animContentFade,
          }}>
          <TextElement
            h4
            medium
            h4Style={{
              paddingHorizontal: 14,
              marginTop: 14,
              marginBottom: 10,
              color: Color.textPrimary,
            }}>
            Available Restaurants
          </TextElement>
          <FlatList
            data={displayList}
            renderItem={renderRestaurantCard}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
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
          placeholder={'Search Restaurant'}
        />
      </View>
      {isOpenList ? (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: headerHeight,
            backgroundColor: Color.background,
            transform: [{ translateY: translateAnim }],
            opacity: animEditCityOp,
          }}>
          {isSearching ? (
            <>
              <TextElement h4 medium h4Style={{paddingHorizontal: 14, marginBottom: 10, color: Color.textPrimary}}>
                {`${displayList.length} ${displayList.length === 1 ? 'Restaurant' : 'Restaurants'} Found`}
              </TextElement>
              <FlatList
                data={displayList}
                renderItem={renderRestaurantItem}
                keyExtractor={(item, index) =>
                  item?.id?.toString() ?? index.toString()
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.listContent}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={5}
                removeClippedSubviews
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
            </>
          ) : (
            <View style={styles.searchHereWrap}>
              <View style={styles.searchHereIconCircle}>
                <Search size={26} strokeWidth={2.2} color={Color.headerBlue} />
              </View>
              <Text style={styles.searchHereTitle}>Search here</Text>
              <Text style={styles.searchHereSubtitle}>
                Start typing to discover your favourite restaurant
              </Text>
            </View>
          )}
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

      <BottomSheet isBottomSafeArea={true} refRBSheet={modalizeRef}>
        <CalenderComponent
          isBus={true}
          oneWay={1}
          departureDate={selectedDate}
          selectedDate={depDate => {
            setSelectedDate(depDate);
            modalizeRef.current?.close();
          }}
        />
      </BottomSheet>
    </View>
  );
};

export default SearchSelection;

const styles = StyleSheet.create({
  topHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    borderColor: Color.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    backgroundColor: '#E8F0FE',
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
});
