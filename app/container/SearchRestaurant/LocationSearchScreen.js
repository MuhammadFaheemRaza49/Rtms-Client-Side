import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';
import { searchRestaurants, setSearchQuery } from '../../redux/restaurant';

// Custom Outline Icons
const MapPinIcon = ({ color = Color.headerBlue, size = 18 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.65,
      height: size * 0.65,
      borderRadius: (size * 0.65) / 2,
      borderWidth: 1.8,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <View style={{ width: size * 0.2, height: size * 0.2, borderRadius: (size * 0.2) / 2, backgroundColor: color }} />
      <View style={{
        position: 'absolute',
        bottom: -4,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 4.5,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }} />
    </View>
  </View>
);

const CutleryIcon = ({ color = Color.headerBlue, size = 18 }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ marginRight: 2, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 5 }}>
        <View style={{ width: 1.0, height: 4, backgroundColor: color }} />
        <View style={{ width: 1.0, height: 4, backgroundColor: color }} />
        <View style={{ width: 1.0, height: 4, backgroundColor: color }} />
      </View>
      <View style={{ width: 5, height: 1.5, backgroundColor: color, borderBottomLeftRadius: 1.5, borderBottomRightRadius: 1.5 }} />
      <View style={{ width: 1.0, height: 5, backgroundColor: color }} />
    </View>
    <View style={{ marginLeft: 2, alignItems: 'center' }}>
      <View style={{ width: 1.8, height: 6, backgroundColor: color, borderTopRightRadius: 2.5, borderBottomRightRadius: 0.8 }} />
      <View style={{ width: 1.0, height: 5, backgroundColor: color }} />
    </View>
  </View>
);

const SUGGESTIONS = [
  { id: '1', name: 'Random Coffee Shop With Great Lights' },
  { id: '2', name: 'Random Coffee Shop With Great Lights' },
  { id: '3', name: 'Random Coffee Shop With Great Lights' },
  { id: '4', name: 'Random Coffee Shop With Great Lights' },
];

const LocationSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [localQuery, setLocalQuery] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSuggestionPress = (queryText) => {
    dispatch(setSearchQuery(queryText));
    dispatch(searchRestaurants(queryText));
    navigation.navigate(NavigationPath.SearchResults, { query: queryText });
  };

  const handleSearchSubmit = () => {
    const q = localQuery.trim();
    if (q.length > 0) {
      handleSuggestionPress(q);
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
              placeholder="Search Restaurants"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={localQuery}
              onChangeText={setLocalQuery}
              onSubmitEditing={handleSearchSubmit}
              autoFocus
            />
          </View>
        </View>
      </View>

      {/* Main List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Current Location</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSuggestionPress('Nearby')}
          >
            <View style={styles.iconBadge}>
              <MapPinIcon color={Color.headerBlue} size={18} />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Nearby</Text>
              <Text style={styles.itemSubtitle}>Use my Current Location</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Suggested Results Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Suggested Results</Text>
          {SUGGESTIONS.map((item, index) => (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              style={styles.listItem}
              onPress={() => handleSuggestionPress(item.name)}
            >
              <View style={styles.iconBadge}>
                <CutleryIcon color={Color.headerBlue} size={18} />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.suggestionTitle}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.surface,
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
  content: {
    flex: 1,
    backgroundColor: Color.background,
  },
  section: {
    marginBottom: Constants.spacing.small,
    backgroundColor: Color.surface,
  },
  sectionHeader: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: Constants.spacing.large,
    paddingBottom: Constants.spacing.small,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Constants.spacing.large,
    paddingVertical: Constants.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(21, 82, 179, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Constants.spacing.large,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  itemSubtitle: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginTop: 1,
  },
  suggestionTitle: {
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
  },
});

export default LocationSearchScreen;