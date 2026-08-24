import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Animated,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import Images from '../../common/Images';
import NavigationPath from '../../navigation/NavigationPath';

import { FloorPlanCanvas } from '../../components/canvas/FloorPlanCanvas';
import DatePickerModal from '../BookTable/DatePickerModal';
import TimeSlotSelectModal from '../BookTable/TimeSlotSelectModal';

import { getRestaurantDetails } from '../../redux/restaurant';
import {
  setSelectedDate,
  setSelectedTimeSlot,
  setSpecialRequests,
} from '../../redux/booking';
import {
  selectTable,
  deselectTable,
  toggleJoinTables,
  setHighChairCount,
  toggleWheelchair,
  selectFloor,
  getTables,
  getFloorTables,
} from '../../redux/tables';

// Precise outline icons matching Figma screenshots exactly
const ClockIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <View style={{ width: size, height: size, borderWidth: 1.8, borderColor: color, borderRadius: size / 2, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <View style={{ width: 1.8, height: size * 0.35, backgroundColor: color, position: 'absolute', top: 2 }} />
    <View style={{ width: size * 0.25, height: 1.8, backgroundColor: color, position: 'absolute', top: size / 2 - 0.9, left: size / 2 - 0.9 }} />
  </View>
);

const PinIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: (size * 0.7) / 2,
      borderWidth: 1.8,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <View style={{ width: size * 0.22, height: size * 0.22, borderRadius: (size * 0.22) / 2, backgroundColor: color }} />
      <View style={{
        position: 'absolute',
        bottom: -4.5,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 4.5,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }} />
    </View>
  </View>
);

const ClocheIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 6, marginBottom: 1 }}>
      <View style={{ width: 1, height: 2, backgroundColor: color }} />
      <View style={{ width: 1, height: 2, backgroundColor: color }} />
    </View>
    <View style={{ width: 3, height: 1.5, borderRadius: 1, backgroundColor: color, marginBottom: 0.5 }} />
    <View style={{ width: size * 0.75, height: (size * 0.75) / 2, borderTopLeftRadius: 99, borderTopRightRadius: 99, borderBottomWidth: 1.5, borderColor: color, overflow: 'hidden' }} />
    <View style={{ width: size * 0.9, height: 1.5, backgroundColor: color, marginTop: 0.5, borderRadius: 0.5 }} />
  </View>
);

const ShareIcon = ({ color = '#FFF', size = 20 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <View style={{ width: size * 0.7, height: size * 0.6, borderWidth: 1.8, borderColor: color, borderTopWidth: 0, borderRadius: 2, marginTop: 4 }} />
    <View style={{ position: 'absolute', top: 1, width: 1.8, height: size * 0.5, backgroundColor: color }} />
    <View style={{
      position: 'absolute',
      top: 1,
      width: 0,
      height: 0,
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderBottomWidth: 5,
      borderStyle: 'solid',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
    }} />
  </View>
);

const LandscapeIcon = ({ color = '#FFF', size = 16 }) => (
  <View style={{ width: size, height: size * 0.85, borderWidth: 1.8, borderColor: color, borderRadius: 2, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
    <View style={{ width: 3.5, height: 3.5, borderRadius: 1.75, backgroundColor: color, position: 'absolute', top: 2, left: 2 }} />
    <View style={{ width: size * 0.7, height: size * 0.7, borderWidth: 1.8, borderColor: color, borderLeftWidth: 0, borderBottomWidth: 0, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: -size * 0.35, left: 1 }} />
    <View style={{ width: size * 0.5, height: size * 0.5, borderWidth: 1.8, borderColor: color, borderLeftWidth: 0, borderBottomWidth: 0, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: -size * 0.3, right: 0.5 }} />
  </View>
);

const CalendarIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <View style={{ width: size, height: size, borderWidth: 1.8, borderColor: color, borderRadius: 3.5, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 1.8, height: 4, backgroundColor: color, position: 'absolute', top: -2.5, left: 3, borderRadius: 1 }} />
    <View style={{ width: 1.8, height: 4, backgroundColor: color, position: 'absolute', top: -2.5, right: 3, borderRadius: 1 }} />
    <View style={{ width: '100%', height: 1.5, backgroundColor: color, position: 'absolute', top: 3.5 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 8, marginTop: 4 }}>
      <View style={{ width: 1.8, height: 1.8, borderRadius: 0.9, backgroundColor: color }} />
      <View style={{ width: 1.8, height: 1.8, borderRadius: 0.9, backgroundColor: color }} />
    </View>
  </View>
);

const HighChairIcon = ({ color = Color.textPrimary, size = 28 }) => (
  <View style={{ width: size, height: size, padding: 2 }}>
    <View style={{ width: 2, height: size * 0.45, backgroundColor: color, position: 'absolute', left: 4, top: 2 }} />
    <View style={{ height: 2, width: size * 0.55, backgroundColor: color, position: 'absolute', left: 4, top: size * 0.45 }} />
    <View style={{ height: 3, width: size * 0.6, backgroundColor: color, borderRadius: 1.5, position: 'absolute', left: 2, top: size * 0.3 }} />
    <View style={{ width: 2, height: size * 0.5, backgroundColor: color, position: 'absolute', left: 6, top: size * 0.45, transform: [{ rotate: '15deg' }] }} />
    <View style={{ width: 2, height: size * 0.5, backgroundColor: color, position: 'absolute', right: 8, top: size * 0.45, transform: [{ rotate: '-15deg' }] }} />
    <View style={{ height: 1.5, width: size * 0.45, backgroundColor: color, position: 'absolute', left: 6, bottom: size * 0.15 }} />
  </View>
);

const WheelchairIcon = ({ color = Color.textPrimary, size = 28 }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <View style={{ width: 5, height: 5, borderRadius: 2.5, borderWidth: 1.5, borderColor: color, position: 'absolute', top: 2, left: size * 0.45 }} />
    <View style={{ width: 1.5, height: 10, backgroundColor: color, position: 'absolute', top: 7, left: size * 0.45, transform: [{ rotate: '-10deg' }] }} />
    <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: (size * 0.5) / 2, borderWidth: 1.5, borderColor: color, position: 'absolute', bottom: 2, left: size * 0.2 }} />
    <View style={{ height: 1.5, width: 8, backgroundColor: color, position: 'absolute', top: 12, left: size * 0.5 }} />
    <View style={{ width: 1.5, height: 6, backgroundColor: color, position: 'absolute', top: 12, left: size * 0.5 + 7, transform: [{ rotate: '20deg' }] }} />
  </View>
);

// Amenity Icons precisely matching the screenshot
const WifiIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round">
    <Path d="M12 18a1.5 1.5 0 0 1 0-3" />
    <Path d="M8.5 13.5a5 5 0 0 1 7 0" />
    <Path d="M5 10a10 10 0 0 1 14 0" />
    <Path d="M1.5 6.5a15 15 0 0 1 21 0" />
  </Svg>
);

const ValetIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 11h10l-1.5-4h-7L7 11z" />
    <Rect x="4" y="11" width="16" height="5" rx="1" />
    <Circle cx="7.5" cy="13.5" r="1" fill={color} stroke="none" />
    <Circle cx="16.5" cy="13.5" r="1" fill={color} stroke="none" />
    <Path d="M6 16v2h2v-2" />
    <Path d="M16 16v2h2v-2" />
  </Svg>
);

const OutdoorIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5c-4 0-6 3-6 6h12c0-3-2-6-6-6z" />
    <Path d="M12 11v9" />
    <Path d="M9 20h6" />
    <Path d="M12 5c.5-1.5 1.5-2.5 3-2" />
  </Svg>
);

const SmokingIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="13" width="13" height="3" rx="0.5" />
    <Line x1="12" y1="13" x2="12" y2="16" />
    <Path d="M18 13c.5-1 1.5-1 1-3.5" />
    <Path d="M20.5 13c.5-1 1.5-1 1-3.5" />
  </Svg>
);

const MusicIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 17V5l10-2v12" />
    <Circle cx="6.5" cy="17.5" r="2.5" />
    <Circle cx="16.5" cy="15.5" r="2.5" />
    <Path d="M9 9l10-2" strokeWidth={2} />
  </Svg>
);

const WheelchairIconSmall = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="1.5" />
    <Path d="M8 12h6v3.5" />
    <Path d="M10 8.5v3.5l4.5 3.5" />
    <Path d="M15 15a4.5 4.5 0 1 1-9 0" />
  </Svg>
);

const PrayerIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 19v-4c0-3 3-5 6-5s6 2 6 5v4" />
    <Path d="M12 10V4.5" />
    <Path d="M10.5 4c.5-1.5 2.5-1.5 3 0" />
    <Path d="M4 19h16" />
    <Path d="M10 19v-3c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v3" />
  </Svg>
);

const KidsIcon = ({ color = '#1E2937', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="13" r="7" />
    <Path d="M9.5 15.5c.8 1 2.2 1.5 3.5 1.5s2.7-.5 3.5-1.5" />
    <Circle cx="9.5" cy="11.5" r="0.8" fill={color} stroke="none" />
    <Circle cx="14.5" cy="11.5" r="0.8" fill={color} stroke="none" />
    <Path d="M12 6a2 2 0 0 0-2-2" />
    <Path d="M5 13.5a1.5 1.5 0 0 1 0-2M19 13.5a1.5 1.5 0 0 0 0-2" />
  </Svg>
);

const UserAvatarIcon = ({ size = 32 }) => (
  <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }}>
    <View style={{
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: (size * 0.4) / 2,
      backgroundColor: '#9CA3AF',
      marginTop: 2,
    }} />
    <View style={{
      width: size * 0.75,
      height: size * 0.35,
      borderRadius: (size * 0.75) / 2,
      backgroundColor: '#9CA3AF',
      marginTop: 1.5,
    }} />
  </View>
);

const RestaurantDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(21, 82, 179, 0.25)', Color.headerBlue],
    extrapolate: 'clamp',
  });

  const { restaurantId } = route.params || {};

  // Redux Selectors
  const { selectedRestaurant, loading, error } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, specialRequests } = useSelector((state) => state.booking);
  const { selectedFloorId, selectedTableIds, joinTables, additionalNeeds, floors, tablesByFloor, branchId: loadedBranchId } = useSelector((state) => state.tables);

  // Local States
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [parentScrollEnabled, setParentScrollEnabled] = useState(true);

  // Fetch details, floors, and tables on mount
  useEffect(() => {
    const targetId = restaurantId || '00000000-0000-7000-8000-000000000030';
    if (!selectedRestaurant || selectedRestaurant.id !== targetId) {
      dispatch(getRestaurantDetails(targetId));
    }
  }, [dispatch, restaurantId, selectedRestaurant]);

  // Preload floors and tables list to render the mini canvas layout instantly, updating on date/time change
  useEffect(() => {
    const targetId = restaurantId || '00000000-0000-7000-8000-000000000030';
    dispatch(getTables(targetId, selectedDate, selectedTimeSlot));
  }, [dispatch, restaurantId, selectedDate, selectedTimeSlot]);

  if (loading || !selectedRestaurant) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.headerBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => dispatch(getRestaurantDetails(restaurantId || 'nearby-2'))}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    name,
    rating,
    reviewCount,
    address,
    about,
    highlights,
    hours,
    depositAmount,
    currency,
  } = selectedRestaurant;

  // Table info lookup
  const TABLE_INFO = {
    'table-1': { num: '1', seats: '4 Seater' },
    'table-2': { num: '2', seats: '4 Seater' },
    'table-3': { num: '3', seats: '6 Seater' },
    'table-4': { num: '4', seats: '2 Seater' },
    'table-5': { num: '5', seats: '6 Seater' },
    'table-6': { num: '6', seats: '4 Seater' },
  };
  const activeFloor = floors && floors.find((f) => f.id === selectedFloorId);

  const handleTableToggle = (tableId) => {
    if (selectedTableIds.includes(tableId)) {
      dispatch(deselectTable(tableId));
    } else {
      dispatch(selectTable(tableId));
    }
  };

  return (
    <View style={styles.container}>
      {/* Absolute Overlay Header with smooth animated color transition */}
      <Animated.View style={[styles.headerOverlay, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: headerBackgroundColor }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <ShareIcon color="#FFF" size={20} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        scrollEnabled={parentScrollEnabled}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* 1. Hero Image Header Block */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => setImageModalVisible(true)}
          style={styles.heroContainer}
        >
          <Image
            source={{ uri: Images.placeholders.restaurant }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Photo Count Badge */}
          <View style={styles.photoCountBadge}>
            <LandscapeIcon color="#FFF" size={14} />
            <Text style={styles.photoCountText}>12</Text>
          </View>
        </TouchableOpacity>

        {/* 2. Restaurant Profile Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.restaurantName}>{name || 'Splash Dining Restaurant'}</Text>
          
          {/* Rating Row */}
          <View style={styles.ratingRow}>
            {rating ? (
              <>
                <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
                <Text style={styles.ratingValueText}>{rating}</Text>
              </>
            ) : (
              <Text style={styles.ratingValueText}>Not Rated</Text>
            )}
            <TouchableOpacity>
              <Text style={styles.reviewLinkText}>
                {reviewCount ? `${reviewCount} Reviews` : 'No Reviews'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pricing */}
          <Text style={styles.priceText}>
            From <Text style={styles.boldPrice}>{currency || 'PKR'} {depositAmount !== undefined ? depositAmount.toLocaleString() : 'Not Available'}</Text> Per Person
          </Text>

          <View style={styles.divider} />

          {/* Attribute listings */}
          <View style={styles.attributeRow}>
            <ClocheIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText}>
              {selectedRestaurant.cuisineTags ? selectedRestaurant.cuisineTags.join(', ') : 'Not Available'}
            </Text>
          </View>

          <View style={styles.attributeRow}>
            <PinIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText} numberOfLines={1}>
              {address || 'Not Available'}
            </Text>
          </View>

          <View style={styles.attributeRow}>
            <ClockIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText}>{hours ? `Open • ${hours}` : 'Not Available'}</Text>
          </View>

          <View style={styles.divider} />

          {/* About Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>About Restaurant</Text>
            <Text style={styles.bodyText} numberOfLines={aboutExpanded ? undefined : 3}>
              {about || 'Not Available'}
            </Text>
            {about && (
              <TouchableOpacity onPress={() => setAboutExpanded(!aboutExpanded)}>
                <Text style={styles.readMoreText}>{aboutExpanded ? 'Read Less' : 'Read More'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 3. Highlights Section */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightsCard}>
            <Text style={styles.highlightsHeader}>Highlights</Text>
            {highlights && highlights.length > 0 ? (
              <View style={styles.bulletList}>
                {highlights.map((h, i) => (
                  <Text key={i} style={styles.bulletPoint}>• {h}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.bulletPoint}>• Not Available</Text>
            )}
            {highlights && highlights.length > 0 && (
              <TouchableOpacity onPress={() => setHighlightsExpanded(!highlightsExpanded)}>
                <Text style={styles.readMoreText}>{highlightsExpanded ? 'Read Less' : 'Read More'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 4. Booking Selection Slots */}
        <View style={styles.bookingDetailsBlock}>
          {/* Select Date Chips */}
          <Text style={styles.blockTitle}>Select Date</Text>
          <View style={styles.chipsRow}>
            {['Fri 7', 'Sat 08', 'Sun 09'].map((dateChip) => {
              const isSelected = selectedDate && selectedDate.includes(dateChip.split(' ')[1] || '09');
              return (
                <TouchableOpacity
                  key={dateChip}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => dispatch(setSelectedDate(`2025-03-${dateChip.split(' ')[1]}`))}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {dateChip}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity 
              style={[
                styles.chip, 
                styles.datePickerBtn,
                // Highlight if custom date selected (not 07, 08, 09)
                selectedDate && !['07', '08', '09'].some(d => selectedDate.endsWith(d)) && styles.chipSelected
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.datePickerBtnIcon}>
                <CalendarIcon color={Color.textSecondary} size={14} />
              </View>
              <Text style={[
                styles.datePickerBtnText,
                selectedDate && !['07', '08', '09'].some(d => selectedDate.endsWith(d)) && styles.chipTextSelected
              ]}>
                {selectedDate && !['07', '08', '09'].some(d => selectedDate.endsWith(d))
                  ? selectedDate.split('-')[2] + '/' + selectedDate.split('-')[1]
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Select Time Chips */}
          <Text style={styles.blockTitle}>Select Time</Text>
          <View style={styles.chipsRow}>
            {['12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM'].map((timeSlot) => {
              const isSelected = selectedTimeSlot?.label === timeSlot;
              return (
                <TouchableOpacity
                  key={timeSlot}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => dispatch(setSelectedTimeSlot({ label: timeSlot, period: 'Lunch' }))}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {timeSlot}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity 
              style={[
                styles.dropdownChip,
                selectedTimeSlot && !['12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM'].includes(selectedTimeSlot.label) && styles.chipSelected
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[
                styles.dropdownChipText,
                selectedTimeSlot && !['12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM'].includes(selectedTimeSlot.label) && styles.chipTextSelected
              ]}>
                {selectedTimeSlot && !['12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM'].includes(selectedTimeSlot.label)
                  ? selectedTimeSlot.label
                  : 'More ˅'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          <DatePickerModal
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            initialDate={selectedDate ? new Date(selectedDate) : new Date()}
            onConfirm={(date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              dispatch(setSelectedDate(`${year}-${month}-${day}`));
            }}
          />

          {/* Time Slot Picker Modal */}
          <TimeSlotSelectModal
            visible={showTimePicker}
            onClose={() => setShowTimePicker(false)}
            initialSlot={selectedTimeSlot}
            onConfirm={(slot) => {
              dispatch(setSelectedTimeSlot(slot));
            }}
          />

          {/* Special Requests */}
          <Text style={styles.blockTitleWithOptional}>
            Special Requests <Text style={styles.optionalLabel}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.requestInput}
            placeholder="Any Special Requests?"
            placeholderTextColor={Color.textMuted}
            value={specialRequests}
            onChangeText={(text) => dispatch(setSpecialRequests(text))}
            multiline={false}
          />
        </View>

        {/* 5. Live Floor View Section */}
        <View style={styles.floorPlanBlock}>
          <View style={styles.floorPlanHeaderRow}>
            <Text style={styles.floorPlanTitle}>Live Floor View</Text>
            
            {/* Select Floor Dropdown Button */}
            <TouchableOpacity
              style={styles.selectFloorBtn}
              onPress={() => setShowFloorDropdown(!showFloorDropdown)}
            >
              <Text style={styles.selectFloorBtnText}>
                {(() => {
                  const activeFloor = floors && floors.find((f) => f.id === selectedFloorId);
                  return activeFloor ? (activeFloor.nameI18n?.en || activeFloor.name) : 'Select Floor';
                })()}
              </Text>
              <View style={styles.selectFloorChevron}>
                <Text style={styles.selectFloorChevronText}>▾</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.floorPlanSubTitle}>Select your preferred table from the live layout</Text>

          {/* Floor selection dropdown */}
          {showFloorDropdown && floors && floors.length > 0 && (
            <View style={styles.floorDropdown}>
              {floors.map((f, index) => {
                const isActive = selectedFloorId === f.id;
                const label = f.nameI18n?.en || f.name || 'Floor';
                const firstChar = label.charAt(0).toUpperCase();
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.dropdownItem,
                      isActive && styles.dropdownItemActive,
                      index < floors.length - 1 && styles.dropdownItemBorder,
                    ]}
                    onPress={() => {
                      dispatch(selectFloor(f.id));
                      dispatch(getFloorTables(f.id, selectedDate, selectedTimeSlot));
                      setShowFloorDropdown(false);
                    }}
                  >
                    <View style={[styles.dropdownItemIcon, isActive && styles.dropdownItemIconActive]}>
                      <Text style={[styles.dropdownItemIconText, isActive && styles.dropdownItemIconTextActive]}>{firstChar}</Text>
                    </View>
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>{label}</Text>
                    {isActive && (
                      <View style={styles.dropdownCheckIcon}>
                        <Text style={styles.dropdownCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* View Mode controls */}
          <View style={styles.viewModeRow}>
            <TouchableOpacity style={styles.modeBtn}>
              {/* Framed picture icon matching screenshot */}
              <View style={styles.loungeIcon}>
                <View style={styles.loungeIconFrame}>
                  <View style={styles.loungeIconMountain} />
                  <View style={styles.loungeIconSun} />
                </View>
              </View>
              <Text style={styles.modeBtnText}>Lounge View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modeBtn}
              onPress={() => navigation.navigate(NavigationPath.LiveFloorView)}
            >
              {/* Expand/fullscreen icon matching screenshot */}
              <View style={styles.expandIcon}>
                <View style={[styles.expandArrow, styles.expandArrowTL]} />
                <View style={[styles.expandArrow, styles.expandArrowBR]} />
              </View>
              <Text style={styles.modeBtnText}>View Full Screen</Text>
            </TouchableOpacity>
          </View>

          {/* Legend dots */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Color.available }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Color.occupied }]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Color.reserved }]} />
              <Text style={styles.legendText}>Reserved</Text>
            </View>
          </View>

          {/* Interactive Floor Plan Canvas */}
          <View style={styles.miniCanvasContainer}>
            <FloorPlanCanvas
              tables={(selectedFloorId && tablesByFloor && tablesByFloor[selectedFloorId]) || []}
              selectedTableIds={selectedTableIds}
              onTablePress={handleTableToggle}
              canvasMeta={(() => {
                const activeFloor = floors && floors.find((f) => f.id === selectedFloorId);
                return activeFloor?.canvasMeta;
              })()}
              onTouchStart={() => setParentScrollEnabled(false)}
              onTouchEnd={() => setParentScrollEnabled(true)}
            />
          </View>

          {/* Selected Table Header */}
          {selectedTableIds.length > 0 && (
            <Text style={styles.selectedTableHeader}>
              Selected Table{selectedTableIds.length > 1 ? 's' : ''}
            </Text>
          )}

          {/* Selected Table details cards — one for each selected table */}
          {selectedTableIds.map((tableId) => {
            const allTables = tablesByFloor && selectedFloorId ? (tablesByFloor[selectedFloorId] || []) : [];
            const matchedTable = allTables.find((t) => t.id === tableId);
            const rawLabel = matchedTable?.label || matchedTable?.num || tableId;
            const cleanLabel = rawLabel.replace('T-', '').replace('table-', '');
            
            const tableInfo = {
              num: cleanLabel,
              seats: matchedTable?.capacity ? `${matchedTable.capacity} Seater` : '4 Seater'
            };
            const floorLabel = activeFloor ? (activeFloor.nameI18n?.en || activeFloor.name) : 'Floor Layout';

            return (
              <View key={tableId} style={styles.selectedTableCard}>
                <View style={styles.selectedTableIconBadge}>
                  <View style={styles.tableCircleIcon}>
                    <Text style={styles.tableCircleNum}>{tableInfo.num}</Text>
                  </View>
                </View>
                <View style={styles.selectedTableTexts}>
                  <Text style={styles.selectedTableTitle}>Table No. {tableInfo.num}</Text>
                  <Text style={styles.selectedTableSubTitle}>
                    {tableInfo.seats} • {floorLabel}
                  </Text>
                </View>
                <View style={styles.checkmarkCircle}>
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
              </View>
            );
          })}

          {/* Table join toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Would you like to join the selected tables</Text>
            <Switch
              value={joinTables}
              onValueChange={() => dispatch(toggleJoinTables())}
              trackColor={{ false: '#D1D5DB', true: Color.headerBlue }}
            />
          </View>
        </View>

        {/* 6. Additional Needs Stepper/Toggles */}
        <View style={styles.additionalNeedsBlock}>
          <Text style={styles.blockTitle}>Additional Needs</Text>

          {/* High Chair Row */}
          <View style={styles.stepperItemRow}>
            <View style={styles.stepperItemLeft}>
              <View style={styles.iconBadge}>
                <HighChairIcon color={Color.textPrimary} size={28} />
              </View>
              <View>
                <Text style={styles.stepperItemTitle}>High Chair</Text>
                <Text style={styles.stepperItemDesc}>Need a baby / infant chair</Text>
              </View>
            </View>
            <View style={styles.stepperController}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setHighChairCount(Math.max(0, additionalNeeds.highChairCount - 1)))}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperCountText}>{additionalNeeds.highChairCount}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setHighChairCount(additionalNeeds.highChairCount + 1))}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wheelchair Row */}
          <View style={styles.stepperItemRow}>
            <View style={styles.stepperItemLeft}>
              <View style={styles.iconBadge}>
                <WheelchairIcon color={Color.textPrimary} size={28} />
              </View>
              <View>
                <Text style={styles.stepperItemTitle}>Wheelchair</Text>
                <Text style={styles.stepperItemDesc}>Guest uses a wheelchair</Text>
              </View>
            </View>
            <Switch
              value={additionalNeeds.wheelchair}
              onValueChange={() => dispatch(toggleWheelchair())}
              trackColor={{ false: '#D1D5DB', true: Color.headerBlue }}
            />
          </View>
        </View>

        {/* 7. Popular Menu horizontal list (Restored) */}
        <View style={styles.menuBlock}>
          <View style={styles.blockHeaderRow}>
            <Text style={styles.blockTitle}>Popular Menu</Text>
            <TouchableOpacity onPress={() => navigation.navigate(NavigationPath.Menu, { restaurantId })}>
              <Text style={styles.viewFullMenuText}>View Full Menu &gt;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalMenuContent}>
            {[
              { id: 'm1', name: 'Alfredo Pasta', price: 'PKR 1,650' },
              { id: 'm2', name: 'Margherita Pizza', price: 'PKR 1,650' },
              { id: 'm3', name: 'Grilled Steak', price: 'PKR 1,650' }
            ].map((menuItem) => (
              <View key={menuItem.id} style={styles.menuCard}>
                <Image
                  source={{ uri: Images.placeholders.foodItem }}
                  style={styles.menuItemImage}
                  resizeMode="cover"
                />
                <View style={styles.menuItemDetails}>
                  <Text style={styles.menuItemName}>{menuItem.name}</Text>
                  <Text style={styles.menuItemPrice}>{menuItem.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 8. Amenities Grid */}
        <View style={styles.amenitiesBlock}>
          <Text style={styles.blockTitle}>Amenities</Text>
          {selectedRestaurant.amenities && selectedRestaurant.amenities.length > 0 ? (
            <View style={styles.bulletList}>
              {selectedRestaurant.amenities.map((amenity, index) => (
                <Text key={index} style={styles.bulletPoint}>• {amenity}</Text>
              ))}
            </View>
          ) : (
            <Text style={styles.bulletPoint}>• Not Available</Text>
          )}
        </View>

        {/* 9. Things to Know & Policies */}
        <View style={styles.policiesBlock}>
          <Text style={styles.blockTitle}>Things to Know</Text>
          <View style={styles.policyList}>
            {selectedRestaurant.thingsToKnow && selectedRestaurant.thingsToKnow.length > 0 ? (
              selectedRestaurant.thingsToKnow.map((item, idx) => (
                <Text key={idx} style={styles.policyBullet}>• {item}</Text>
              ))
            ) : (
              <Text style={styles.policyBullet}>• Not Available</Text>
            )}
          </View>

          <View style={styles.spacer} />

          <Text style={styles.blockTitle}>Reservation Policy</Text>
          <View style={styles.policyList}>
            {selectedRestaurant.reservationPolicy && selectedRestaurant.reservationPolicy.length > 0 ? (
              selectedRestaurant.reservationPolicy.map((item, idx) => (
                <Text key={idx} style={styles.policyBullet}>• {item}</Text>
              ))
            ) : (
              <Text style={styles.policyBullet}>• Not Available</Text>
            )}
          </View>
        </View>

        {/* 10. Reviews Block */}
        <View style={styles.reviewsBlock}>
          <Text style={styles.blockTitle}>Reviews</Text>
          {selectedRestaurant.reviews && selectedRestaurant.reviews.length > 0 ? (
            <>
              <Text style={styles.ratingBigText}>{selectedRestaurant.rating || '4.8'}/5</Text>
              <Text style={styles.reviewSubText}>{selectedRestaurant.reviewCount || '0'} Reviews</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalReviewsContent}>
                {selectedRestaurant.reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeaderRow}>
                      <View style={styles.reviewAvatar}>
                        <UserAvatarIcon size={32} />
                      </View>
                      <View>
                        <Text style={styles.reviewerName}>{review.userName || review.name}</Text>
                        <Text style={styles.reviewDate}>{review.date || 'Recent'}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewStars}>★ ★ ★ ★ ★</Text>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={styles.policyBullet}>• Not Available</Text>
          )}
        </View>
      </Animated.ScrollView>

      {/* Full-Screen Image Viewer Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.closeFullBtn} 
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={styles.closeFullText}>✕</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: Images.placeholders.restaurant }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomBarRow}>
          <Text style={styles.totalAmountLabel}>Total Amount</Text>
          <Text style={styles.totalAmountVal}>{currency || 'PKR'} {depositAmount !== undefined ? depositAmount.toLocaleString() : 'Not Available'}</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveBtn}
          onPress={() => navigation.navigate(NavigationPath.DateTimeSelect, { restaurantId: selectedRestaurant?.id })}
        >
          <Text style={styles.reserveBtnText}>Reserve Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Constants.spacing.large,
  },
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackArrow: {
    color: Color.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -6,
  },
  headerTitle: {
    color: Color.white,
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Color.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeFullBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullText: {
    color: Color.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 30, // Offset badge slightly from cards overlap
    right: Constants.spacing.medium,
    backgroundColor: 'rgba(21, 82, 179, 0.9)',
    borderRadius: Constants.borderRadius.medium,
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCountText: {
    color: Color.white,
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: Color.surface,
    borderTopLeftRadius: Constants.borderRadius.large,
    borderTopRightRadius: Constants.borderRadius.large,
    marginTop: -20,
    padding: Constants.spacing.large,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.tiny,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
  },
  starText: {
    color: Color.starColor,
    fontSize: 14,
    marginRight: 6,
  },
  ratingValueText: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginRight: Constants.spacing.small,
  },
  reviewLinkText: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.headerBlue,
    textDecorationLine: 'underline',
  },
  priceText: {
    fontSize: Constants.fontSize.body,
    color: Color.textSecondary,
  },
  boldPrice: {
    color: Color.textPrimary,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: Color.border,
    marginVertical: Constants.spacing.medium,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.small,
  },
  attributeText: {
    fontSize: Constants.fontSize.body,
    color: Color.textSecondary,
    marginLeft: Constants.spacing.medium,
  },
  sectionBlock: {
    marginTop: Constants.spacing.tiny,
  },
  sectionHeader: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.small,
  },
  bodyText: {
    fontSize: Constants.fontSize.body,
    color: Color.textSecondary,
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.headerBlue,
    marginTop: Constants.spacing.small,
  },
  highlightsContainer: {
    paddingHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  highlightsCard: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.large,
  },
  highlightsHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.medium,
  },
  bulletList: {
    marginBottom: Constants.spacing.small,
  },
  bulletPoint: {
    fontSize: 14,
    color: Color.textSecondary,
    marginBottom: 6,
    lineHeight: 22,
    paddingLeft: 4,
  },
  bookingDetailsBlock: {
    backgroundColor: Color.surface,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: Constants.spacing.large,
    paddingBottom: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.medium,
  },
  blockTitleWithOptional: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.medium,
  },
  optionalLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: Color.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Color.border,
    borderRadius: 20,
    backgroundColor: Color.surface,
  },
  chipSelected: {
    borderColor: Color.headerBlue,
    borderWidth: 2,
    backgroundColor: Color.surface,
  },
  chipText: {
    fontSize: 13,
    color: Color.textSecondary,
  },
  chipTextSelected: {
    color: Color.textPrimary,
    fontWeight: '600',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerBtnIcon: {
    marginRight: 6,
  },
  datePickerBtnText: {
    fontSize: 13,
    color: Color.textSecondary,
  },
  dropdownChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Color.border,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownChipText: {
    fontSize: 13,
    color: Color.textSecondary,
  },
  requestInput: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: 12,
    height: 48,
    fontSize: 14,
    color: Color.textPrimary,
  },
  floorPlanBlock: {
    backgroundColor: Color.surface,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: Constants.spacing.large,
    paddingBottom: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  floorPlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  floorPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  floorPlanSubTitle: {
    fontSize: 13,
    color: Color.textSecondary,
    marginBottom: 16,
  },
  selectFloorBtn: {
    backgroundColor: Color.headerBlue,
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectFloorBtnText: {
    color: Color.white,
    fontWeight: '600',
    fontSize: 13,
    marginRight: 6,
  },
  selectFloorChevron: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectFloorChevronText: {
    color: Color.white,
    fontSize: 10,
    marginTop: -1,
  },
  floorDropdown: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 12,
    paddingVertical: 4,
    position: 'absolute',
    right: Constants.spacing.large,
    top: 55,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minWidth: 180,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(21, 82, 179, 0.06)',
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dropdownItemIconActive: {
    backgroundColor: Color.headerBlue,
  },
  dropdownItemIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Color.textSecondary,
  },
  dropdownItemIconTextActive: {
    color: Color.white,
  },
  dropdownItemText: {
    color: Color.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  dropdownItemTextActive: {
    color: Color.headerBlue,
    fontWeight: '600',
  },
  dropdownCheckIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Color.headerBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownCheckText: {
    color: Color.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  viewModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
    gap: 12,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  modeBtnText: {
    color: Color.textSecondary,
    fontSize: 13,
  },
  loungeIcon: {
    marginRight: 6,
  },
  loungeIconFrame: {
    width: 16,
    height: 13,
    borderWidth: 1.5,
    borderColor: Color.textSecondary,
    borderRadius: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  loungeIconMountain: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Color.textSecondary,
    position: 'absolute',
    bottom: 0,
    left: 2,
    transform: [{ rotate: '180deg' }],
  },
  loungeIconSun: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: Color.textSecondary,
    position: 'absolute',
    top: 1.5,
    right: 2,
  },
  expandIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
    position: 'relative',
  },
  expandArrow: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderColor: Color.textSecondary,
    borderWidth: 1.5,
  },
  expandArrowTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  expandArrowBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: Color.textSecondary,
  },
  miniCanvasContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: Constants.spacing.large,
  },
  selectedTableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.25)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  selectedTableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 10,
  },
  tableCircleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Color.headerBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCircleNum: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedTableIconBadge: {
    marginRight: Constants.spacing.medium,
  },
  selectedTableTexts: {
    flex: 1,
  },
  selectedTableTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  selectedTableSubTitle: {
    fontSize: 12,
    color: Color.textSecondary,
    marginTop: 2,
  },
  checkmarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Color.available,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
    flex: 0.8,
  },
  additionalNeedsBlock: {
    backgroundColor: Color.surface,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  stepperItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Constants.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  stepperItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.7,
  },
  iconBadge: {
    marginRight: Constants.spacing.medium,
  },
  stepperItemTitle: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  stepperItemDesc: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginTop: 1,
  },
  stepperController: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    color: Color.textPrimary,
    fontWeight: 'bold',
  },
  stepperCountText: {
    width: 32,
    textAlign: 'center',
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
    fontWeight: 'bold',
  },
  menuBlock: {
    backgroundColor: Color.surface,
    paddingVertical: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  viewFullMenuText: {
    color: Color.headerBlue,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.bodySmall,
  },
  horizontalMenuContent: {
    paddingHorizontal: Constants.spacing.large,
  },
  menuCard: {
    width: 140,
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
    marginRight: Constants.spacing.medium,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: '100%',
    height: 100,
  },
  menuItemDetails: {
    padding: Constants.spacing.small,
  },
  menuItemName: {
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 2,
  },
  menuItemPrice: {
    fontSize: Constants.fontSize.caption,
    color: Color.textSecondary,
  },
  amenitiesBlock: {
    backgroundColor: Color.surface,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: Constants.spacing.large,
    paddingBottom: 20,
    marginBottom: Constants.spacing.large,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amenityItem: {
    flex: 1,
    alignItems: 'center',
  },
  amenityIconContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  amenityLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  amenityDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
  policiesBlock: {
    backgroundColor: Color.surface,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  policyList: {
    marginTop: Constants.spacing.small,
  },
  policyBullet: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    lineHeight: 18,
    marginBottom: Constants.spacing.tiny,
  },
  spacer: {
    height: Constants.spacing.large,
  },
  reviewsBlock: {
    backgroundColor: Color.surface,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: Constants.spacing.large,
    paddingBottom: 110, // extra padding so content doesn't get hidden behind bottom sticky bar
  },
  ratingBigText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginTop: Constants.spacing.tiny,
  },
  reviewSubText: {
    fontSize: 13,
    color: Color.textSecondary,
    marginBottom: Constants.spacing.medium,
  },
  horizontalReviewsContent: {
    paddingRight: Constants.spacing.large,
    gap: 16,
  },
  reviewCard: {
    width: 290,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 12,
    padding: Constants.spacing.large,
    backgroundColor: Color.surface,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  reviewDate: {
    fontSize: 11,
    color: Color.textSecondary,
    marginTop: 1,
  },
  reviewStars: {
    color: Color.starColor,
    fontSize: 14,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 13,
    color: Color.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewImagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewThumb: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  viewAllBtn: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Color.headerBlue,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bottomBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalAmountLabel: {
    fontSize: 15,
    color: Color.textSecondary,
  },
  totalAmountVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  reserveBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Constants.spacing.large,
  },
  errorText: {
    color: '#DC2626',
    fontSize: Constants.fontSize.body,
    marginBottom: Constants.spacing.medium,
  },
  retryBtn: {
    backgroundColor: Color.headerBlue,
    paddingHorizontal: Constants.spacing.large,
    paddingVertical: Constants.spacing.small,
    borderRadius: Constants.borderRadius.small,
  },
  retryText: {
    color: Color.white,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailsScreen;
