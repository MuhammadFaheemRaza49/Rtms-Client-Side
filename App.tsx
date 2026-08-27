import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import DateTimeSelectScreen from './app/container/BookTable/DateTimeSelectScreen';
import LiveFloorViewScreen from './app/container/BookTable/LiveFloorViewScreen';
import GuestDetailsScreen from './app/container/BookTable/GuestDetailsScreen';
import ChargesSummaryScreen from './app/container/Checkout/ChargesSummaryScreen';
import ReviewDetailsScreen from './app/container/Checkout/ReviewDetailsScreen';
import BookingConfirmationScreen from './app/container/BookTable/BookingConfirmationScreen';
import MyBookingsScreen from './app/container/BookTable/MyBookingsScreen';
import BookingDetailsScreen from './app/container/BookTable/BookingDetailsScreen';
import NavigationPath from './app/navigation/NavigationPath';
import Color from './app/common/Color';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                  options={{ animation: 'fade_from_bottom' }}
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
                <Stack.Screen
                  name={NavigationPath.DateTimeSelect}
                  component={DateTimeSelectScreen}
                />
                <Stack.Screen
                  name={NavigationPath.LiveFloorView}
                  component={LiveFloorViewScreen}
                />

                <Stack.Screen
                  name={NavigationPath.AdditionalNeeds}
                  component={GuestDetailsScreen}
                />

                <Stack.Screen
                  name={NavigationPath.ReviewDetails}
                  component={ReviewDetailsScreen}
                />
                <Stack.Screen
                  name={NavigationPath.ChargesSummary}
                  component={ChargesSummaryScreen}
                />
                <Stack.Screen
                  name={NavigationPath.BookingConfirmation}
                  component={BookingConfirmationScreen}
                />
                <Stack.Screen
                  name={NavigationPath.MyBookings}
                  component={MyBookingsScreen}
                />
                <Stack.Screen
                  name={NavigationPath.BookingDetails}
                  component={BookingDetailsScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </LanguageProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
