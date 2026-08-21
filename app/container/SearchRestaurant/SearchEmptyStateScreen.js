import React from 'react';
import {
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
import NavigationPath from '../../navigation/NavigationPath';
import { searchRestaurants, setSearchQuery } from '../../redux/restaurant';

// Custom vector outline documents + magnifying glass illustration
const EmptyDocIcon = ({ color = Color.headerBlue, size = 90 }) => (
  <View style={{ width: size, height: size * 1.1, justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: Constants.spacing.large }}>
    {/* Stacked Sheet back */}
    <View style={{
      position: 'absolute',
      top: size * 0.12,
      left: size * 0.15,
      width: size * 0.55,
      height: size * 0.72,
      borderWidth: 1.5,
      borderColor: 'rgba(21, 82, 179, 0.4)',
      borderRadius: 4,
      backgroundColor: Color.surface
    }} />
    {/* Stacked Sheet front */}
    <View style={{
      position: 'absolute',
      top: size * 0.06,
      left: size * 0.22,
      width: size * 0.55,
      height: size * 0.72,
      borderWidth: 1.5,
      borderColor: color,
      borderRadius: 4,
      backgroundColor: Color.surface,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Inner outline magnifying glass */}
      <View style={{
        width: size * 0.28,
        height: size * 0.28,
        borderRadius: (size * 0.28) / 2,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <Text style={{ fontSize: size * 0.16, fontWeight: 'bold', color }}>?</Text>
        {/* Handle */}
        <View style={{
          position: 'absolute',
          bottom: -5,
          right: -5,
          width: 1.5,
          height: 8,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }]
        }} />
      </View>
    </View>
  </View>
);

const SearchEmptyStateScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { query } = route.params || {};
  const { searchQuery } = useSelector((state) => state.restaurant);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAutocorrectPress = () => {
    const corrected = 'Restaurant';
    dispatch(setSearchQuery(corrected));
    dispatch(searchRestaurants(corrected));
    navigation.navigate(NavigationPath.SearchResults, { query: corrected });
  };

  const handleSearchSubmit = (text) => {
    if (text.trim().length > 0) {
      dispatch(setSearchQuery(text));
      dispatch(searchRestaurants(text));
      navigation.navigate(NavigationPath.SearchResults, { query: text });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Container */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.textInput}
              value={query || searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              onSubmitEditing={(e) => handleSearchSubmit(e.nativeEvent.text)}
              placeholder="Search Restaurant"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
        </View>
      </View>

      {/* Suggestion Bar */}
      <View style={styles.suggestionBar}>
        <Text style={styles.suggestionLabel}>Did you mean? </Text>
        <TouchableOpacity onPress={handleAutocorrectPress}>
          <Text style={styles.suggestionValue}>Restaurant</Text>
        </TouchableOpacity>
      </View>

      {/* Center Empty State */}
      <View style={styles.content}>
        <EmptyDocIcon color={Color.headerBlue} size={100} />
        
        <Text style={styles.headline}>Looks like autocorrect betrayed you 😅</Text>
        
        <Text style={styles.paragraph}>
          Maybe a little typo? Try again or pick from the list above.
        </Text>
      </View>
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
  suggestionBar: {
    flexDirection: 'row',
    backgroundColor: Color.surface,
    paddingHorizontal: Constants.spacing.large,
    paddingVertical: Constants.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  suggestionLabel: {
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
  },
  suggestionValue: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.headerBlue,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Constants.spacing.xlarge,
  },
  headline: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    textAlign: 'center',
    marginBottom: Constants.spacing.small,
  },
  paragraph: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SearchEmptyStateScreen;