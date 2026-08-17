import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';
import RestApi from '../../services/restclient/RestApi';

import { createBooking } from '../../redux/booking';

export default function ReviewDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedRestaurant } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, guestCount, specialRequests, loading } = useSelector((state) => state.booking);
  const { selectedTableIds, additionalNeeds } = useSelector((state) => state.tables);
  const { highChairCount, wheelchair } = additionalNeeds || { highChairCount: 0, wheelchair: false };

  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policyResponse = await RestApi.get(`/portal/branches/${activeBranchId}/booking-policy`);
        setPolicy(policyResponse);
      } catch (err) {
        console.warn('Failed to load policy in checkout:', err.message);
      }
    };
    fetchPolicy();
  }, [activeBranchId]);

  const handleConfirm = async () => {
    if (policy && policy.depositRequired) {
      // Navigate to deposit charges summary / payment screen
      navigation.navigate(NavigationPath.ChargesSummary, { restaurantId: activeBranchId });
    } else {
      // Direct booking creation — pass fields that createBooking converts to backend format
      const payload = {
        date: selectedDate,
        startTime: selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[0] : '18:00',
        endTime: selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[1] : '19:30',
        startsAt: selectedTimeSlot?.startsAt || null,
        partySize: guestCount,
        specialRequests,
        tableIds: selectedTableIds.length > 0
          ? selectedTableIds
          : (selectedTimeSlot?.tableIds || []),
      };

      try {
        await dispatch(createBooking(payload, activeBranchId));
        // Reset navigation stack to home or success page
        navigation.navigate(NavigationPath.BookingConfirmation);
      } catch (err) {
        console.warn('Booking creation failed:', err.message);
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Restaurant summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Restaurant</Text>
          <Text style={styles.restaurantName}>{selectedRestaurant?.name || 'Rare Gulberg'}</Text>
          <Text style={styles.restaurantLoc}>{selectedRestaurant?.address || 'Lahore, Pakistan'}</Text>
        </View>

        {/* Booking details */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Reservation Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Time Slot</Text>
            <Text style={styles.value}>{selectedTimeSlot?.label || 'Not Selected'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Guests</Text>
            <Text style={styles.value}>{guestCount} Guests</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Selected Tables</Text>
            <Text style={styles.value}>{selectedTableIds.length} Chosen</Text>
          </View>
        </View>

        {/* Additional Needs */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Additional Needs</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>High Chairs</Text>
            <Text style={styles.value}>{highChairCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Wheelchair Access</Text>
            <Text style={styles.value}>{wheelchair ? 'Yes' : 'No'}</Text>
          </View>
          {specialRequests ? (
            <View style={styles.specialReqBox}>
              <Text style={styles.label}>Special Request Note:</Text>
              <Text style={styles.specialReqVal}>{specialRequests}</Text>
            </View>
          ) : null}
        </View>

        {/* Deposit Warning policy if applicable */}
        {policy && policy.depositRequired && (
          <View style={styles.depositWarningCard}>
            <Text style={styles.warningTitle}>⚠️ Deposit Required</Text>
            <Text style={styles.warningText}>
              This branch requires a deposit of {policy.depositAmount} {policy.currency || 'SAR'} to secure your booking.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {loading ? (
          <ActivityIndicator size="small" color={Color.headerBlue} />
        ) : (
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>
              {policy && policy.depositRequired ? 'Proceed to Deposit Payment' : 'Confirm Reservation'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  scrollContent: {
    padding: Constants.spacing.large,
    paddingBottom: 100,
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
  restaurantLoc: {
    fontSize: 13,
    color: Color.textSecondary,
    marginTop: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.border,
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
  specialReqBox: {
    marginTop: 12,
  },
  specialReqVal: {
    fontSize: 13,
    color: Color.textPrimary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  depositWarningCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
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
  confirmBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
