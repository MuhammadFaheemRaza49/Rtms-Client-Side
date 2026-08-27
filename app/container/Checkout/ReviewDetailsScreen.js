import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as Lucide from 'lucide-react-native';
import moment from 'moment';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';
import RestApi from '../../services/restclient/RestApi';
import { createBooking } from '../../redux/booking';
import BackIconComponent from '../ComponentsV2/ComponentsV2/BackIconComponent';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ReviewDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId, guestInfo } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedRestaurant } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, guestCount, specialRequests, loading } = useSelector((state) => state.booking);
  const { selectedTableIds, additionalNeeds, floors, tablesByFloor } = useSelector((state) => state.tables);

  const [policy, setPolicy] = useState(null);
  const [hotelSummaryExpanded, setHotelSummaryExpanded] = useState(true);
  const [roomDetailsExpanded, setRoomDetailsExpanded] = useState(true);

  // Editable Contact Info states (Empty by default)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Custom Smooth Bottom Sheet states
  const [showFarePanelState, setShowFarePanelState] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Load policy
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

  const openFarePanel = () => {
    setShowFarePanelState(true);
    // Reset values before starting
    fadeAnim.setValue(0);
    slideAnim.setValue(450);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFarePanel = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 450,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFarePanelState(false);
    });
  };

  const handleConfirm = async () => {
    if (policy && policy.depositRequired) {
      navigation.navigate(NavigationPath.ChargesSummary, { restaurantId: activeBranchId });
    } else {
      const payload = {
        date: selectedDate,
        startTime: selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[0] : '12:00',
        endTime: selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[1] : '13:30',
        startsAt: selectedTimeSlot?.startsAt || null,
        partySize: guestCount,
        specialRequests,
        tableIds: selectedTableIds.length > 0
          ? selectedTableIds
          : (selectedTimeSlot?.tableIds || []),
      };

      try {
        await dispatch(createBooking(payload, activeBranchId));
        navigation.navigate(NavigationPath.BookingConfirmation);
      } catch (err) {
        console.warn('Booking creation failed:', err.message);
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Find selected tables and floor labels
  const selectedTablesList = selectedTableIds.map((tableId) => {
    let matchedTable = null;
    if (tablesByFloor) {
      for (const fId of Object.keys(tablesByFloor)) {
        const found = tablesByFloor[fId]?.find((t) => t.id === tableId);
        if (found) {
          matchedTable = found;
          break;
        }
      }
    }
    const cleanNum = matchedTable?.label 
      ? matchedTable.label.replace('T-', '').replace('table-', '') 
      : tableId.substring(0, 4);

    const tableFloor = floors && floors.find((f) => f.id === matchedTable?.floorId);
    return {
      id: tableId,
      num: cleanNum,
      capacity: matchedTable?.capacity || matchedTable?.capacityMax || 4,
      floorName: tableFloor ? (tableFloor.nameI18n?.en || tableFloor.name) : 'Ground Floor',
    };
  });

  const checkInTime = selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[0] : '12:00 PM';
  const checkOutTime = selectedTimeSlot?.label ? selectedTimeSlot.label.split(' - ')[1] : '01:30 PM';
  const displayDateStr = selectedDate ? moment(selectedDate, 'YYYY-MM-DD').format('ddd, MMM DD, YYYY') : 'Fri, Aug 28, 2026';

  // Dynamic booking amounts based on policy
  const depositAmountVal = policy && policy.depositRequired ? parseFloat(policy.depositAmount) : 5000; 
  const displayAmount = `PKR ${depositAmountVal.toLocaleString()}`;

  // Breakdown values
  const basePrice = Math.round(depositAmountVal * 0.78);
  const tax = Math.round(depositAmountVal * 0.125);
  const platformFee = 34;
  const serviceCharges = depositAmountVal - basePrice - tax - platformFee;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Blue Header */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10, paddingBottom: 12 }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack}>
            <BackIconComponent color="#FFF" />
          </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Details</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hotel/Restaurant Summary Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setHotelSummaryExpanded(!hotelSummaryExpanded)}
              style={styles.cardHeaderBlue}
            >
              <Text style={styles.cardHeaderBlueText}>Restaurant Summary</Text>
              {hotelSummaryExpanded ? (
                <Lucide.ChevronUp color="#FFF" size={20} />
              ) : (
                <Lucide.ChevronDown color="#FFF" size={20} />
              )}
            </TouchableOpacity>
            
            {hotelSummaryExpanded && (
              <View style={styles.cardBody}>
                <Text style={styles.restaurantName}>{selectedRestaurant?.name || 'Rare Gulberg'}</Text>
                <Text style={styles.restaurantAddress}>{selectedRestaurant?.address || 'Gurumangat Road N-24,25 Gulberg ii Lahore Pakistan'}</Text>
                
                <View style={styles.divider} />

                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Reservation</Text>
                    <Text style={styles.gridValue}>Table Booking</Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Guests</Text>
                    <Text style={styles.gridValue}>{guestCount} {guestCount > 1 ? 'Adults' : 'Adult'}</Text>
                  </View>
                </View>

                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Arrival</Text>
                    <Text style={styles.gridValue}>{displayDateStr} - {checkInTime}</Text>
                  </View>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Departure</Text>
                    <Text style={styles.gridValue}>{displayDateStr} - {checkOutTime}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Room/Table Details Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setRoomDetailsExpanded(!roomDetailsExpanded)}
              style={styles.cardHeaderBlue}
            >
              <Text style={styles.cardHeaderBlueText}>Table Details</Text>
              {roomDetailsExpanded ? (
                <Lucide.ChevronUp color="#FFF" size={20} />
              ) : (
                <Lucide.ChevronDown color="#FFF" size={20} />
              )}
            </TouchableOpacity>
  
            {roomDetailsExpanded && (
              <View style={styles.cardBody}>
                {guestInfo && (
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.guestHeaderRow}>
                      <Lucide.User color="#4B5563" size={16} style={{ marginRight: 6 }} />
                      <Text style={styles.guestTitle}>Guest Info (Lead Passenger)</Text>
                    </View>
                    <View style={styles.gridRow}>
                      <View style={styles.gridCol}>
                        <Text style={styles.gridLabel}>Name</Text>
                        <Text style={styles.gridValue}>
                          {guestInfo.salutation}. {guestInfo.fullName || 'Shahzaib Asif'}
                        </Text>
                      </View>
                      <View style={styles.gridCol}>
                        <Text style={styles.gridLabel}>{guestInfo.idType}</Text>
                        <Text style={styles.gridValue}>{guestInfo.idNumber || 'Not Provided'}</Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                )}

                {selectedTablesList.length > 0 ? (
                  selectedTablesList.map((table, index) => (
                    <View key={table.id} style={{ marginTop: index > 0 ? 16 : 0 }}>
                      <View style={styles.guestHeaderRow}>
                        <Lucide.Utensils color="#4B5563" size={16} style={{ marginRight: 6 }} />
                        <Text style={styles.guestTitle}>Table {index + 1}</Text>
                      </View>
                      <View style={styles.gridRow}>
                        <View style={styles.gridCol}>
                          <Text style={styles.gridLabel}>Table No</Text>
                          <Text style={styles.gridValue}>{table.num}</Text>
                        </View>
                        <View style={styles.gridCol}>
                          <Text style={styles.gridLabel}>Floor</Text>
                          <Text style={styles.gridValue}>{table.floorName}</Text>
                        </View>
                        <View style={styles.gridCol}>
                          <Text style={styles.gridLabel}>Capacity</Text>
                          <Text style={styles.gridValue}>{table.capacity} Seater</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.guestHeaderRow}>
                    <Text style={styles.gridValue}>No tables selected. System will assign.</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Contact Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderBlue}>
              <Text style={styles.cardHeaderBlueText}>Contact Details</Text>
            </View>
            <View style={styles.cardBody}>
              {/* Warning Alert Banner */}
              <View style={styles.alertBox}>
                <Lucide.Info color="#1D4ED8" size={18} style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.alertText}>
                  Heads up! We'll text or email your booking details to the info you gave us.
                </Text>
              </View>

              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Lucide.Mail color="#9CA3AF" size={16} style={{ marginRight: 8 }} />
                <TextInput 
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🇵🇰</Text>
                <TextInput 
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Sticky Payment Bar */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.bottomBarTop}>
            <View>
              <Text style={styles.amountLabel}>Amount to be paid</Text>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={openFarePanel}
                style={styles.fareDetailsBtn}
              >
                <Text style={styles.fareDetailsBtnText}>View Fare Details</Text>
                <Lucide.ChevronUp color="#0B4FA4" size={14} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
            <Text style={styles.amountValue}>{displayAmount}</Text>
          </View>

          <TouchableOpacity 
            style={styles.confirmBtn} 
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.confirmBtnText}>Proceed To Payment</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Fare Details Smooth Overlay Panel */}
        {showFarePanelState && (
          <View style={styles.modalOverlayContainer}>
            {/* Smooth Fade Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={closeFarePanel} activeOpacity={1} />
            </Animated.View>

            {/* Smooth Spring Slide up Card */}
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.modalHandle} />
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Base Price</Text>
                <Text style={styles.fareValue}>PKR {basePrice.toLocaleString()}</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Tax</Text>
                <Text style={styles.fareValue}>PKR {tax.toLocaleString()}</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Platform Fee</Text>
                <Text style={styles.fareValue}>PKR {platformFee}</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Service Charges</Text>
                <Text style={styles.fareValue}>PKR {serviceCharges.toLocaleString()}</Text>
              </View>
              <View style={[styles.fareRow, styles.fareRowTotal]}>
                <Text style={styles.fareLabelTotal}>Amount to be paid</Text>
                <Text style={styles.fareValueTotal}>{displayAmount}</Text>
              </View>

              <TouchableOpacity 
                style={styles.modalBtn} 
                onPress={closeFarePanel}
              >
                <Text style={styles.modalBtnText}>Got It!</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#0B4FA4',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeaderBlue: {
    backgroundColor: '#0B4FA4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderBlueText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  guestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 14,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bottomBarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  amountLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  fareDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  fareDetailsBtnText: {
    fontSize: 13,
    color: '#0B4FA4',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B4FA4',
  },
  confirmBtn: {
    backgroundColor: '#0B4FA4',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    maxHeight: '50%',
    zIndex: 10000,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  fareRowTotal: {
    borderBottomWidth: 0,
    marginTop: 8,
    marginBottom: 16,
  },
  fareLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  fareLabelTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  fareValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B4FA4',
  },
  modalBtn: {
    backgroundColor: '#0B4FA4',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
