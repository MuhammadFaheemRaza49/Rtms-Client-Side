import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import RestApi from '../../services/restclient/RestApi';

import { getBookingDetails, cancelBooking } from '../../redux/bookingHistory';

export default function BookingDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { bookingId } = route.params || {};
  const activeBranchId = '00000000-0000-7000-8000-000000000030';

  const { selectedBooking, loading, error } = useSelector((state) => state.bookingHistory);
  const [cancelQuote, setCancelQuote] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingDetails(bookingId, activeBranchId));
    }
  }, [dispatch, bookingId]);

  // Determine if booking is in a cancellable state
  const isCancellable = selectedBooking && (selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending');

  // Load cancellation quote policy
  useEffect(() => {
    if (isCancellable) {
      const fetchQuote = async () => {
        try {
          const quote = await RestApi.get(`/portal/branches/${activeBranchId}/bookings/${selectedBooking.id}/cancel-quote`);
          setCancelQuote(quote);
        } catch (err) {
          console.warn('Failed to load cancel quote:', err.message);
        }
      };
      fetchQuote();
    }
  }, [selectedBooking]);

  const handleCancelBooking = () => {
    const refundInfo = cancelQuote ? `Refund: ${cancelQuote.refundPercent}%` : 'Standard cancellation policy applies.';
    Alert.alert(
      'Cancel Reservation?',
      `Are you sure you want to cancel this booking? ${refundInfo}`,
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Cancel Reservation',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await dispatch(cancelBooking(selectedBooking.id, activeBranchId, 'User requested cancellation'));
            } catch (err) {
              console.warn('Failed to cancel booking:', err.message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || !selectedBooking) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Color.headerBlue} />
      </View>
    );
  }

  const isCancelled = selectedBooking.status === 'cancelled';
  const isCompleted = selectedBooking.status === 'completed' || selectedBooking.status === 'no_show' || selectedBooking.status === 'seated';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reservation Details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status banner */}
        <View style={[styles.statusBanner, isCancelled ? styles.statusBannerCancelled : styles.statusBannerUpcoming]}>
          <Text style={[styles.statusBannerText, isCancelled ? styles.statusTextCancelled : styles.statusTextUpcoming]}>
            Booking is {selectedBooking.status || 'upcoming'}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.restaurantName}>{selectedBooking.restaurantName || 'Rare Gulberg'}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reservation Code</Text>
            <Text style={styles.value}>{selectedBooking.code || selectedBooking.id?.substring(0, 8)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{selectedBooking.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{selectedBooking.startTime} - {selectedBooking.endTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Party Size</Text>
            <Text style={styles.value}>{selectedBooking.partySize} Guests</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, isCancelled ? styles.statusTextCancelled : styles.statusTextUpcoming]}>
              {selectedBooking.status}
            </Text>
          </View>
        </View>

        {/* Additional information */}
        {(selectedBooking.highChairCount > 0 || selectedBooking.wheelchairAccessRequired || selectedBooking.specialRequests) && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Requirements</Text>
            {selectedBooking.highChairCount > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>High Chairs</Text>
                <Text style={styles.value}>{selectedBooking.highChairCount}</Text>
              </View>
            )}
            {selectedBooking.wheelchairAccessRequired && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Wheelchair Access</Text>
                <Text style={styles.value}>Yes</Text>
              </View>
            )}
            {selectedBooking.specialRequests ? (
              <View style={styles.notesBox}>
                <Text style={styles.label}>Notes:</Text>
                <Text style={styles.notesText}>{selectedBooking.specialRequests}</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Action Footer */}
      {isCancellable && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {cancelling ? (
            <ActivityIndicator size="small" color={Color.headerBlue} />
          ) : (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelBooking}>
              <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
            </TouchableOpacity>
          )}
        </View>
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
  scrollContent: {
    padding: Constants.spacing.large,
    paddingBottom: 100,
  },
  statusBanner: {
    borderRadius: Constants.borderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
  },
  statusBannerUpcoming: {
    backgroundColor: '#D1FAE5',
  },
  statusBannerCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusTextUpcoming: {
    color: '#059669',
  },
  statusTextCancelled: {
    color: '#DC2626',
  },
  card: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Color.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Color.border,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  notesBox: {
    marginTop: 12,
  },
  notesText: {
    fontSize: 13,
    color: Color.textPrimary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Color.surface,
    borderTopWidth: 1,
    borderTopColor: Color.border,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: 12,
    elevation: 10,
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
