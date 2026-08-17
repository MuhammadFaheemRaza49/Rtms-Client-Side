import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';

export default function BookingConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleGoHome = () => {
    navigation.navigate(NavigationPath.SearchRestaurant);
  };

  const handleGoToBookings = () => {
    navigation.navigate(NavigationPath.MyBookings);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Large green premium checkmark */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✓</Text>
        </View>

        <Text style={styles.title}>Reservation Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your table has been successfully reserved. We have sent the details to your registered contact.
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.bookingsBtn} onPress={handleGoToBookings}>
            <Text style={styles.bookingsBtnText}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome}>
            <Text style={styles.homeBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Constants.spacing.large,
  },
  content: {
    alignItems: 'center',
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.large,
    padding: Constants.spacing.large * 2,
    borderWidth: 1,
    borderColor: Color.border,
    width: '100%',
    maxWidth: 340,
    elevation: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Constants.spacing.large,
  },
  iconText: {
    color: '#10B981',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Color.textPrimary,
    textAlign: 'center',
    marginBottom: Constants.spacing.medium,
  },
  subtitle: {
    fontSize: 14,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Constants.spacing.large * 1.5,
  },
  btnRow: {
    width: '100%',
    gap: 12,
  },
  bookingsBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bookingsBtnText: {
    color: Color.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  homeBtn: {
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  homeBtnText: {
    color: Color.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
