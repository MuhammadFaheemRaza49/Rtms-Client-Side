import React, { useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import Images from '../../common/Images';
import NavigationPath from '../../navigation/NavigationPath';

import {
  searchRestaurants,
  getRestaurantDetails,
  setSearchQuery,
} from '../../redux/restaurant';

// Figma-Style Custom Vector Outline Icons
const EditIcon = ({ color = Color.white, size = 16 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '45deg' }] }}>
    <View style={{ width: size * 0.3, height: size * 0.7, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, borderTopLeftRadius: 1, borderTopRightRadius: 1 }} />
    <View style={{ width: 0, height: 0, borderLeftWidth: size * 0.15, borderRightWidth: size * 0.15, borderTopWidth: size * 0.25, borderStyle: 'solid', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color }} />
  </View>
);

const FilterIcon = ({ color = Color.textPrimary, size = 18 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 10, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
    <View style={{ width: 6, height: 1.5, backgroundColor: color }} />
  </View>
);

const SearchResultsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Route Params
  const { query } = route.params || {};

  // Redux Selectors
  const {
    searchResults,
    nearby: recommendations,
    loading,
    error,
    searchQuery,
  } = useSelector((state) => state.restaurant);

  // Trigger search on mount
  useEffect(() => {
    const activeQuery = query !== undefined ? query : (searchQuery || '');
    dispatch(setSearchQuery(activeQuery));
    dispatch(searchRestaurants(activeQuery));
  }, [dispatch, query]);

  // Redirect to EmptyState / Typo screen if search resolves with 0 results
  useEffect(() => {
    if (!loading && searchResults && searchResults.length === 0 && searchQuery) {
      navigation.navigate(NavigationPath.SearchEmptyState, { query: searchQuery });
    }
  }, [loading, searchResults, searchQuery, navigation]);

  const handleRestaurantPress = (id) => {
    dispatch(getRestaurantDetails(id));
    navigation.navigate(NavigationPath.RestaurantDetails, { restaurantId: id });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderHeader = () => {
    return (
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          {/* Search box with edit pencil */}
          <View style={styles.searchBox}>
            <TextInput
              style={styles.textInput}
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              onSubmitEditing={() => dispatch(searchRestaurants(searchQuery))}
              placeholder="Search Restaurant"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            <View style={styles.iconContainer}>
              <EditIcon color={Color.white} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderGridCard = (item, index) => {
    return (
      <TouchableOpacity
        key={`${item.id}-${index}`}
        style={styles.gridCard}
        onPress={() => handleRestaurantPress(item.id)}
      >
        <Image
          source={{ uri: item.imageUrl || Images.placeholders.restaurant }}
          style={styles.gridCardImage}
          resizeMode="cover"
        />
        <View style={styles.gridCardInfo}>
          <Text style={styles.gridCardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.gridCardLoc} numberOfLines={1}>
            {item.location}
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

  const renderSearchResultCard = (item, index) => {
    return (
      <View key={item.id || index} style={styles.gridContainer}>
        {renderGridCard(item, index)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Results Info Sub-bar */}
        <View style={styles.summaryBar}>
          <View style={styles.foundTextRow}>
            <Text style={styles.summaryText}>
              {searchResults.length} {searchResults.length === 1 ? 'Restaurant' : 'Restaurants'} Found
            </Text>
            {loading && (
              <ActivityIndicator
                size="small"
                color={Color.headerBlue}
                style={styles.spinner}
              />
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <FilterIcon color={Color.textPrimary} size={18} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dispatch(searchRestaurants(searchQuery))}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <View style={styles.gridContainer}>
              {searchResults.map((item, index) => renderGridCard(item, index))}
            </View>
          </View>
        )}

        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurants You Might Like</Text>
            <View style={styles.gridContainer}>
              {recommendations.map((item, index) =>
                renderGridCard(item, index)
              )}
            </View>
          </View>
        )}
      </ScrollView>
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
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.inputBackground,
    borderWidth: 1,
    borderColor: Color.inputBorder,
    borderRadius: Constants.borderRadius.medium,
    paddingHorizontal: Constants.spacing.medium,
    height: 48,
  },
  textInput: {
    flex: 1,
    color: Color.white,
    fontSize: Constants.fontSize.body,
    padding: 0,
  },
  iconContainer: {
    marginLeft: Constants.spacing.small,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: Constants.spacing.medium,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  foundTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  spinner: {
    marginLeft: Constants.spacing.small,
  },
  filterButton: {
    width: 36,
    height: 36,
    backgroundColor: Color.white,
    borderRadius: Constants.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.border,
  },
  section: {
    marginBottom: Constants.spacing.large,
  },
  sectionTitle: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    paddingHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  largeCard: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.large,
    marginHorizontal: Constants.spacing.large,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
    marginBottom: Constants.spacing.medium,
  },
  largeCardImage: {
    width: '100%',
    height: 180,
  },
  largeCardInfo: {
    padding: Constants.spacing.large,
  },
  largeCardName: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.tiny,
  },
  largeCardLoc: {
    fontSize: Constants.fontSize.body,
    color: Color.textSecondary,
    marginBottom: Constants.spacing.small,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Constants.spacing.large,
  },
  gridCard: {
    width: '48%',
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
    marginBottom: Constants.spacing.medium,
  },
  gridCardImage: {
    width: '100%',
    height: 110,
  },
  gridCardInfo: {
    padding: Constants.spacing.medium,
  },
  gridCardName: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 2,
    lineHeight: 18,
  },
  gridCardLoc: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginBottom: Constants.spacing.tiny,
  },
  errorContainer: {
    padding: Constants.spacing.large,
    alignItems: 'center',
    backgroundColor: Color.redBackgroundHighligther,
    marginHorizontal: Constants.spacing.large,
    borderRadius: Constants.borderRadius.medium,
    marginBottom: Constants.spacing.medium,
  },
  errorText: {
    color: Color.delete,
    fontSize: Constants.fontSize.body,
    marginBottom: Constants.spacing.medium,
  },
  retryButton: {
    backgroundColor: Color.delete,
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

export default SearchResultsScreen;
