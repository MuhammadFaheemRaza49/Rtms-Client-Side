import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';

import { getMyBookings, getBookingDetails } from '../../redux/bookingHistory';

export default function MyBookingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { bookings, loading, error } = useSelector((state) => state.bookingHistory);

  useEffect(() => {
    // Uses the default branch ID for reference lists
    dispatch(getMyBookings('00000000-0000-7000-8000-000000000030'));
  }, [dispatch]);

  const handleBookingPress = (bookingId) => {
    dispatch(getBookingDetails(bookingId, '00000000-0000-7000-8000-000000000030'));
    navigation.navigate(NavigationPath.BookingDetails, { bookingId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderBookingItem = ({ item }) => {
    const isCancelled = item.status === 'cancelled';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleBookingPress(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.restaurantName}>{item.restaurantName || 'Rare Gulberg'}</Text>
          <View style={[styles.statusBadge, isCancelled ? styles.statusCancelled : styles.statusUpcoming]}>
            <Text style={[styles.statusText, isCancelled ? styles.statusTextCancelled : styles.statusTextUpcoming]}>
              {item.status || 'upcoming'}
            </Text>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.detailText}>📅 Date: {item.date}</Text>
          <Text style={styles.detailText}>🕒 Time: {item.startTime} - {item.endTime}</Text>
          <Text style={styles.detailText}>👥 Party Size: {item.partySize} Guests</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Reservations</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Color.headerBlue} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>No reservations found yet!</Text>
          <Text style={styles.emptySubtext}>Time to treat yourself to a delicious meal! ✨</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: Constants.spacing.medium,
  },
  backIcon: {
    color: Color.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Color.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Constants.spacing.large,
  },
  listContent: {
    padding: Constants.spacing.large,
  },
  card: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Constants.spacing.small,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Constants.spacing.small,
    paddingVertical: Constants.spacing.tiny,
    borderRadius: Constants.borderRadius.small,
  },
  statusUpcoming: {
    backgroundColor: '#D1FAE5',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusTextUpcoming: {
    color: '#059669',
  },
  statusTextCancelled: {
    color: '#DC2626',
  },
  cardDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: Color.textSecondary,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  emptyText: {
    color: Color.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Constants.spacing.tiny,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Constants.spacing.medium,
  },
  emptySubtext: {
    color: Color.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
