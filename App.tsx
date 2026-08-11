import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import store from './app/store/configureStore';
import { LanguageProvider } from './app/config/LanguageProvider';
import SearchRestaurantScreen from './app/container/SearchRestaurant/SearchRestaurantScreen';
import SearchResultsScreen from './app/container/SearchRestaurant/SearchResultsScreen';
import LocationSearchScreen from './app/container/SearchRestaurant/LocationSearchScreen';
import SearchEmptyStateScreen from './app/container/SearchRestaurant/SearchEmptyStateScreen';
import RestaurantDetailsScreen from './app/container/RestaurantDetails/RestaurantDetailsScreen';
import NavigationPath from './app/navigation/NavigationPath';
import Color from './app/common/Color';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Color.headerBlue}
          />
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name={NavigationPath.SearchRestaurant}
                component={SearchRestaurantScreen}
              />
              <Stack.Screen
                name={NavigationPath.SearchResults}
                component={SearchResultsScreen}
              />
              <Stack.Screen
                name={NavigationPath.LocationSearch}
                component={LocationSearchScreen}
              />
              <Stack.Screen
                name={NavigationPath.SearchEmptyState}
                component={SearchEmptyStateScreen}
              />
              <Stack.Screen
                name={NavigationPath.RestaurantDetails}
                component={RestaurantDetailsScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
