import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Color from '../../common/Color';
import SearchSelection from './SearchSelection';

// Exact structure of busapp's BusesHomeScreen: the SearchSelection is the
// whole screen — rendered inline full-screen, no overlay, no drop-down.
const SearchRestaurantScreen = ({ route }) => {
  return (
    <View style={[styles.flex, { backgroundColor: Color.headerBlue }]}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={[styles.flex, { backgroundColor: Color.background }]}>
          <SearchSelection style={styles.searchSelection} route={route} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchSelection: {
    width: '100%',
    height: '100%',
  },
});

export default SearchRestaurantScreen;
