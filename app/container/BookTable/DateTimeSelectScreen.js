import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

import {
  setSelectedDate,
  setSelectedTimeSlot,
  setGuestCount,
} from '../../redux/booking';

export default function DateTimeSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedDate, selectedTimeSlot, guestCount } = useSelector((state) => state.booking);

  // States
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  // Load policy and generate dates list on mount
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policyResponse = await RestApi.get(`/portal/branches/${activeBranchId}/booking-policy`);
        setPolicy(policyResponse);
        
        // Default guest count to policy minimum if needed
        if (policyResponse && guestCount < policyResponse.minPartySize) {
          dispatch(setGuestCount(policyResponse.minPartySize));
        }

        // Generate allowed date list starting from today up to advanceMaxDays
        const maxDays = policyResponse?.advanceMaxDays || 30;
        const datesList = [];
        const today = new Date();
        for (let i = 0; i < maxDays; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const iso = `${yyyy}-${mm}-${dd}`;
          
          datesList.push({
            iso,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            monthName: d.toLocaleDateString('en-US', { month: 'short' }),
          });
        }
        setAvailableDates(datesList);

        if (!selectedDate && datesList.length > 0) {
          dispatch(setSelectedDate(datesList[0].iso));
        }
      } catch (err) {
        console.warn('Failed to load booking policy:', err.message);
      }
    };
    fetchPolicy();
  }, [activeBranchId]);

  // Fetch slots availability when date or guestCount changes
  useEffect(() => {
    if (!selectedDate) return;
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await RestApi.get(`/portal/branches/${activeBranchId}/availability`, {
          params: {
            date: selectedDate,
            partySize: guestCount,
            duration: policy?.defaultDurationMin || 90,
          },
        });
        
        // Check for rejection (e.g. PARTY_SIZE_OUT_OF_RANGE)
        if (res && res.rejected) {
          console.warn('Availability rejected:', res.rejected);
          setAvailability([]);
          return;
        }

        // Map backend slots (AvailabilitySlotView[]) into UI-friendly format
        if (res && Array.isArray(res.slots) && res.slots.length > 0) {
          const pad = (n) => String(n).padStart(2, '0');
          const mapped = res.slots.map((slot) => {
            const start = new Date(slot.startsAt);
            const end = new Date(slot.endsAt);
            const startStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
            const endStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
            const hour = start.getHours();
            let period = 'General';
            if (hour < 12) period = 'Morning';
            else if (hour < 17) period = 'Lunch';
            else period = 'Dinner';
            return {
              time: `${startStr} - ${endStr}`,
              startsAt: slot.startsAt,
              endsAt: slot.endsAt,
              isAvailable: true,
              tableIds: slot.tableIds || [],
              combinationIds: slot.combinationIds || [],
              period,
            };
          });
          setAvailability(mapped);
        } else {
          setAvailability([]);
        }
      } catch (err) {
        console.warn('Failed to fetch availability:', err.message);
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate, guestCount, activeBranchId, policy]);

  const handleSelectDate = (dateIso) => {
    dispatch(setSelectedDate(dateIso));
    dispatch(setSelectedTimeSlot(null)); // Reset selected slot
  };

  const handleSelectSlot = (slot) => {
    if (slot.isAvailable) {
      dispatch(setSelectedTimeSlot({
        label: slot.time,
        period: slot.period || 'General',
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        tableIds: slot.tableIds || [],
        combinationIds: slot.combinationIds || [],
      }));
    }
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTimeSlot) return;
    navigation.navigate(NavigationPath.LiveFloorView, { restaurantId: activeBranchId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item.iso;
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.selectedDateCard]}
        onPress={() => handleSelectDate(item.iso)}
      >
        <Text style={[styles.dateDayName, isSelected && styles.selectedText]}>{item.dayName}</Text>
        <Text style={[styles.dateDayNum, isSelected && styles.selectedText]}>{item.dayNum}</Text>
        <Text style={[styles.dateMonth, isSelected && styles.selectedText]}>{item.monthName}</Text>
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
          <Text style={styles.headerTitle}>Select Date & Time</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={availableDates}
            keyExtractor={(item) => item.iso}
            renderItem={renderDateItem}
            contentContainerStyle={styles.datesList}
          />
        </View>

        {/* Guests Stepper */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guests Count</Text>
          <View style={styles.stepperContainer}>
            <Text style={styles.guestDisplay}>
              {guestCount} {guestCount > 1 ? 'Guests' : 'Guest'}
            </Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setGuestCount(Math.max((policy?.minPartySize || 1), guestCount - 1)))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{guestCount}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setGuestCount(Math.min((policy?.maxPartySize || 20), guestCount + 1)))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Slots Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          {loading ? (
            <ActivityIndicator size="large" color={Color.headerBlue} style={styles.spinner} />
          ) : availability.length === 0 ? (
            <Text style={styles.noSlotsText}>No slots available for the selected parameters.</Text>
          ) : (
            <View style={styles.slotsGrid}>
              {availability.map((slot) => {
                const isSelected = selectedTimeSlot?.label === slot.time;
                const isAvail = slot.isAvailable;
                return (
                  <TouchableOpacity
                    key={slot.time}
                    disabled={!isAvail}
                    style={[
                      styles.slotChip,
                      isSelected && styles.selectedSlotChip,
                      !isAvail && styles.disabledSlotChip,
                    ]}
                    onPress={() => handleSelectSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.selectedSlotText,
                        !isAvail && styles.disabledSlotText,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Proceed Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          disabled={!selectedDate || !selectedTimeSlot}
          style={[styles.proceedBtn, (!selectedDate || !selectedTimeSlot) && styles.disabledProceedBtn]}
          onPress={handleProceed}
        >
          <Text style={styles.proceedBtnText}>Proceed to Floor Layout</Text>
        </TouchableOpacity>
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
    paddingVertical: Constants.spacing.large,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Constants.spacing.large,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  datesList: {
    paddingHorizontal: Constants.spacing.large,
  },
  dateCard: {
    width: 65,
    height: 90,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Constants.spacing.small,
  },
  selectedDateCard: {
    backgroundColor: Color.headerBlue,
    borderColor: Color.headerBlue,
  },
  dateDayName: {
    fontSize: 12,
    color: Color.textSecondary,
    marginBottom: 4,
  },
  dateDayNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 4,
  },
  dateMonth: {
    fontSize: 11,
    color: Color.textSecondary,
  },
  selectedText: {
    color: Color.white,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Color.surface,
    marginHorizontal: Constants.spacing.large,
    padding: Constants.spacing.large,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
  },
  guestDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  stepperVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginHorizontal: Constants.spacing.medium,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Constants.spacing.large,
    gap: 8,
  },
  slotChip: {
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.small,
  },
  selectedSlotChip: {
    backgroundColor: Color.headerBlue,
    borderColor: Color.headerBlue,
  },
  disabledSlotChip: {
    backgroundColor: Color.background,
    borderColor: Color.border,
    opacity: 0.5,
  },
  slotText: {
    color: Color.textPrimary,
    fontSize: 13,
  },
  selectedSlotText: {
    color: Color.white,
    fontWeight: 'bold',
  },
  disabledSlotText: {
    color: Color.textMuted,
  },
  spinner: {
    marginTop: Constants.spacing.large,
  },
  noSlotsText: {
    marginHorizontal: Constants.spacing.large,
    color: Color.textMuted,
    fontSize: 14,
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
  proceedBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledProceedBtn: {
    backgroundColor: Color.border,
  },
  proceedBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
