import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import Images from '../../common/Images';
import NavigationPath from '../../navigation/NavigationPath';

import {
  getHomeListings,
  getRestaurantDetails,
  setSearchQuery,
} from '../../redux/restaurant';
import { setGuestCount, setSelectedDate } from '../../redux/booking';

import DatePickerModal from '../BookTable/DatePickerModal';

// Figma-Style Custom Vector Outline Icons
const CutleryIcon = ({ color = '#FFF', size = 18 }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ marginRight: 3, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 6 }}>
        <View style={{ width: 1.2, height: 5, backgroundColor: color }} />
        <View style={{ width: 1.2, height: 5, backgroundColor: color }} />
        <View style={{ width: 1.2, height: 5, backgroundColor: color }} />
      </View>
      <View style={{ width: 6, height: 2, backgroundColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
      <View style={{ width: 1.2, height: 6, backgroundColor: color }} />
    </View>
    <View style={{ marginLeft: 2, alignItems: 'center' }}>
      <View style={{ width: 2, height: 7, backgroundColor: color, borderTopRightRadius: 3, borderBottomRightRadius: 1 }} />
      <View style={{ width: 1.2, height: 6, backgroundColor: color }} />
    </View>
  </View>
);

const CalendarIcon = ({ color = '#FFF', size = 18 }) => (
  <View style={{ width: size, height: size, borderWidth: 1.5, borderColor: color, borderRadius: 3, padding: 2, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ height: 1.5, backgroundColor: color, width: '100%', position: 'absolute', top: 3 }} />
    <View style={{ width: 1.5, height: 3, backgroundColor: color, position: 'absolute', top: -2, left: 3 }} />
    <View style={{ width: 1.5, height: 3, backgroundColor: color, position: 'absolute', top: -2, right: 3 }} />
  </View>
);

const PersonIcon = ({ color = '#FFF', size = 18 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size * 0.45, height: size * 0.45, borderRadius: (size * 0.45) / 2, borderWidth: 1.5, borderColor: color, marginBottom: 1 }} />
    <View style={{ width: size * 0.8, height: size * 0.3, borderTopLeftRadius: size * 0.4, borderTopRightRadius: size * 0.4, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0 }} />
  </View>
);

const SearchIcon = ({ color = '#1552B3', size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: (size * 0.7) / 2,
      borderWidth: 1.8,
      borderColor: color,
      position: 'relative',
    }}>
      <View style={{
        position: 'absolute',
        bottom: -3,
        right: -3,
        width: 1.8,
        height: 5,
        backgroundColor: color,
        transform: [{ rotate: '-45deg' }],
      }} />
    </View>
  </View>
);

const SearchRestaurantScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux Selectors
  const {
    trending,
    nearby,
    featured,
    searchQuery,
    loading: restaurantLoading,
    error: restaurantError,
  } = useSelector((state) => state.restaurant);

  const { selectedDate, guestCount } = useSelector((state) => state.booking);

  // Local States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestStepper, setShowGuestStepper] = useState(false);

  // Fetch Home Listings on Mount
  useEffect(() => {
    dispatch(getHomeListings());
    
    if (!selectedDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dispatch(setSelectedDate(`${yyyy}-${mm}-${dd}`));
    }
  }, [dispatch]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Select Date';
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return isoString;
    const day = dateObj.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${day} ${months[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
  };

  const handleSearchSubmit = () => {
    navigation.navigate(NavigationPath.SearchResults, {
      query: searchQuery,
    });
  };

  const handleRestaurantPress = (id) => {
    dispatch(getRestaurantDetails(id));
    navigation.navigate(NavigationPath.RestaurantDetails, { restaurantId: id });
  };

  const incrementGuests = () => {
    dispatch(setGuestCount(Math.min(20, guestCount + 1)));
  };

  const decrementGuests = () => {
    dispatch(setGuestCount(Math.max(1, guestCount - 1)));
  };

  const renderHeader = () => {
    return (
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Restaurants</Text>
        </View>

        <View style={styles.headerInputs}>
          {/* Search bar */}
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => navigation.navigate(NavigationPath.LocationSearch)}
          >
            <View style={styles.iconContainer}>
              <CutleryIcon color={Color.white} />
            </View>
            <Text style={[styles.inputText, !searchQuery && { color: 'rgba(255, 255, 255, 0.6)' }]}>
              {searchQuery || 'Search Restaurant'}
            </Text>
          </TouchableOpacity>

          {/* Date field */}
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => {
              setShowDatePicker(true);
              setShowGuestStepper(false);
            }}
          >
            <View style={styles.iconContainer}>
              <CalendarIcon color={Color.white} />
            </View>
            <Text style={styles.inputText}>
              {selectedDate ? formatDate(selectedDate) : '22 Mar, 2025'}
            </Text>
          </TouchableOpacity>

          {/* Guest selector & Search Button row */}
          <View style={styles.guestSearchRow}>
            <TouchableOpacity
              style={[styles.inputWrapper, { flex: 1, marginRight: Constants.spacing.small }]}
              onPress={() => setShowGuestStepper(!showGuestStepper)}
            >
              <View style={styles.iconContainer}>
                <PersonIcon color={Color.white} />
              </View>
              <Text style={styles.inputText}>
                {guestCount} {guestCount > 1 ? 'Guests' : 'Guest'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
              <SearchIcon color={Color.headerBlue} size={20} />
            </TouchableOpacity>
          </View>

          {/* Inline Guest Stepper */}
          {showGuestStepper && (
            <View style={styles.guestStepper}>
              <Text style={styles.stepperLabel}>Adjust Guests:</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity style={styles.stepperBtn} onPress={decrementGuests}>
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperCount}>{guestCount}</Text>
                <TouchableOpacity style={styles.stepperBtn} onPress={incrementGuests}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTrendingSection = () => {
    if (restaurantLoading && trending.length === 0) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Color.headerBlue} />
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending Restaurants</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {trending.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trendingCard}
              onPress={() => handleRestaurantPress(item.id)}
            >
              <Image
                source={{ uri: item.imageUrl || Images.placeholders.restaurant }}
                style={styles.trendingImage}
                resizeMode="cover"
              />
              <Text style={styles.trendingName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRestaurantCard = (item, index) => {
    return (
      <TouchableOpacity
        key={`${item.id}-${index}`}
        style={styles.restaurantCard}
        onPress={() => handleRestaurantPress(item.id)}
      >
        <Image
          source={{ uri: item.imageUrl || Images.placeholders.restaurant }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.cardInfo}>
          <Text style={styles.restaurantName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.restaurantLoc} numberOfLines={1}>
            {item.location || 'Lahore, Pakistan'}
          </Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
            <Text style={styles.reviewCountText}>
              ({item.reviewCount || '1,123'})
            </Text>
          </View>
          
          <Text style={styles.priceText}>
            From SAR {item.startingPrice || '300'}
          </Text>
          <Text style={styles.taxText}>Including Tax and Fees</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNearbySection = () => {
    if (restaurantLoading && nearby.length === 0) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Color.headerBlue} />
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 0 }]}>Discover Nearby Restaurants</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {nearby.map((item, index) => renderRestaurantCard(item, index))}
        </ScrollView>
      </View>
    );
  };

  const renderFeaturedSection = () => {
    if (restaurantLoading && featured.length === 0) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Color.headerBlue} />
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Experiences</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {featured.map((item, index) => renderRestaurantCard(item, index))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {restaurantError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {restaurantError || 'Failed to load restaurant list.'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dispatch(getHomeListings())}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {renderTrendingSection()}
        {renderNearbySection()}
        {renderFeaturedSection()}
      </ScrollView>

      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onSelect={(date) => dispatch(setSelectedDate(date))}
        onClose={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headerContainer: {
    backgroundColor: Color.headerBlue,
    paddingHorizontal: Constants.spacing.large,
    paddingBottom: Constants.spacing.large,
    borderBottomLeftRadius: Constants.borderRadius.large,
    borderBottomRightRadius: Constants.borderRadius.large,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.large,
  },
  backButton: {
    marginRight: Constants.spacing.medium,
    paddingVertical: Constants.spacing.tiny,
    paddingHorizontal: Constants.spacing.small,
  },
  backIcon: {
    color: Color.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Color.white,
    fontSize: Constants.fontSize.header,
    fontWeight: 'bold',
  },
  headerInputs: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.inputBackground,
    borderWidth: 1,
    borderColor: Color.inputBorder,
    borderRadius: Constants.borderRadius.medium,
    paddingHorizontal: Constants.spacing.medium,
    height: 48,
    marginBottom: Constants.spacing.medium,
  },
  iconContainer: {
    marginRight: Constants.spacing.medium,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    color: Color.white,
    fontSize: Constants.fontSize.body,
    padding: 0,
  },
  inputText: {
    color: Color.white,
    fontSize: Constants.fontSize.body,
  },
  guestSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: Color.white,
    borderRadius: Constants.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
  },
  guestStepper: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.medium,
    marginBottom: Constants.spacing.small,
  },
  stepperLabel: {
    color: Color.white,
    fontSize: Constants.fontSize.bodySmall,
    marginBottom: Constants.spacing.small,
    fontWeight: 'bold',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Constants.spacing.large,
  },
  stepperBtnText: {
    color: Color.headerBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepperCount: {
    color: Color.white,
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  scrollContent: {
    paddingVertical: Constants.spacing.large,
  },
  sectionContainer: {
    marginBottom: Constants.spacing.xlarge,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  viewAllText: {
    color: Color.headerBlue,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.bodySmall,
  },
  sectionTitle: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    paddingHorizontal: Constants.spacing.large,
  },
  horizontalScrollContent: {
    paddingHorizontal: Constants.spacing.large,
  },
  trendingCard: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    marginRight: Constants.spacing.medium,
    width: 140,
    padding: Constants.spacing.tiny,
    borderWidth: 1,
    borderColor: Color.border,
    alignItems: 'center',
  },
  trendingImage: {
    width: '100%',
    height: 100,
    borderRadius: Constants.borderRadius.small,
    marginBottom: Constants.spacing.tiny,
  },
  trendingName: {
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
    color: Color.textPrimary,
    textAlign: 'center',
  },
  restaurantCard: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    marginRight: Constants.spacing.medium,
    width: 220,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
  },
  cardInfo: {
    padding: Constants.spacing.medium,
  },
  restaurantName: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 2,
    lineHeight: 18,
  },
  restaurantLoc: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginBottom: Constants.spacing.tiny,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.small,
  },
  starText: {
    color: Color.starColor,
    fontSize: 12,
    marginRight: 6,
  },
  reviewCountText: {
    fontSize: Constants.fontSize.caption,
    color: Color.textSecondary,
  },
  priceText: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  taxText: {
    fontSize: Constants.fontSize.caption,
    color: Color.textMuted,
  },
  loaderContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: Constants.spacing.large,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: Constants.spacing.large,
    borderRadius: Constants.borderRadius.medium,
    marginBottom: Constants.spacing.medium,
  },
  errorText: {
    color: '#DC2626',
    fontSize: Constants.fontSize.body,
    marginBottom: Constants.spacing.medium,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: Constants.spacing.large,
    paddingVertical: Constants.spacing.small,
    borderRadius: Constants.borderRadius.small,
  },
  retryText: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.body,
  },
});

export default SearchRestaurantScreen;
