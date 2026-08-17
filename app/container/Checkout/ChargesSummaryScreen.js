import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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
import NavigationPath from '../../navigation/NavigationPath';
import RestApi from '../../services/restclient/RestApi';

import { createBooking } from '../../redux/booking';

export default function ChargesSummaryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedRestaurant } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, guestCount, specialRequests } = useSelector((state) => state.booking);
  const { selectedTableIds, additionalNeeds } = useSelector((state) => state.tables);
  const { highChairCount, wheelchair } = additionalNeeds || { highChairCount: 0, wheelchair: false };

  // States
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policyResponse = await RestApi.get(`/portal/branches/${activeBranchId}/booking-policy`);
        setPolicy(policyResponse);
      } catch (err) {
        console.warn('Failed to load policy in payment:', err.message);
      }
    };
    fetchPolicy();
  }, [activeBranchId]);

  const handlePayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv) return;
    setLoading(true);
    try {
      // 1. Create booking in system
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

      const bookingResult = await dispatch(createBooking(payload, activeBranchId));

      // 2. Process deposit status update
      if (bookingResult && bookingResult.id) {
        await RestApi.post(`/portal/branches/${activeBranchId}/bookings/${bookingResult.id}/deposit/paid`);
      }

      navigation.navigate(NavigationPath.BookingConfirmation);
    } catch (err) {
      console.warn('Payment or booking failed:', err.message);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Deposit Payment</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cost Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Charges Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Deposit Security</Text>
            <Text style={styles.priceValue}>
              {policy?.depositAmount || '100'} {policy?.currency || 'SAR'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Charge</Text>
            <Text style={styles.totalValue}>
              {policy?.depositAmount || '100'} {policy?.currency || 'SAR'}
            </Text>
          </View>
        </View>

        {/* Payment Fields */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Card Details</Text>
          
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Card Number</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="xxxx xxxx xxxx xxxx"
              placeholderTextColor={Color.textMuted}
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.textInput}
            />
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: Constants.spacing.small }]}>
              <Text style={styles.fieldLabel}>Expiry Date</Text>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor={Color.textMuted}
                value={cardExpiry}
                onChangeText={(text) => {
                  // Auto-insert slash after MM
                  if (text.length === 2 && !text.includes('/') && cardExpiry.length < 2) {
                    setCardExpiry(text + '/');
                  } else {
                    setCardExpiry(text);
                  }
                }}
                maxLength={5}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1, marginLeft: Constants.spacing.small }]}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <TextInput
                keyboardType="numeric"
                secureTextEntry
                placeholder="xxx"
                placeholderTextColor={Color.textMuted}
                value={cardCvv}
                onChangeText={setCardCvv}
                style={styles.textInput}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {loading ? (
          <ActivityIndicator size="small" color={Color.headerBlue} />
        ) : (
          <TouchableOpacity
            disabled={!cardNumber || !cardExpiry || !cardCvv}
            style={[styles.payBtn, (!cardNumber || !cardExpiry || !cardCvv) && styles.disabledPayBtn]}
            onPress={handlePayment}
          >
            <Text style={styles.payBtnText}>Pay & Secure Booking</Text>
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
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Color.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.headerBlue,
  },
  fieldGroup: {
    marginBottom: Constants.spacing.medium,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Color.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.small,
    backgroundColor: Color.background,
    paddingHorizontal: Constants.spacing.small,
    height: 40,
    color: Color.textPrimary,
    fontSize: 14,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  payBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledPayBtn: {
    backgroundColor: Color.border,
  },
  payBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
