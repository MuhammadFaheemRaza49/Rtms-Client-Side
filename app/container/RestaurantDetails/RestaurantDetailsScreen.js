import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import Images from '../../common/Images';
import NavigationPath from '../../navigation/NavigationPath';

import { FloorPlanCanvas } from '../../components/canvas/FloorPlanCanvas';

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

const RestaurantDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};

  // Redux Selectors
  const { selectedRestaurant, loading, error } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, specialRequests } = useSelector((state) => state.booking);
  const { selectedFloorId, selectedTableIds, joinTables, additionalNeeds } = useSelector((state) => state.tables);

  // Local States
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);

  // Fetch details on mount if missing
  useEffect(() => {
    if (!selectedRestaurant || selectedRestaurant.id !== restaurantId) {
      dispatch(getRestaurantDetails(restaurantId || 'nearby-2'));
    }
  }, [dispatch, restaurantId, selectedRestaurant]);

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
  } = selectedRestaurant;

  // Selected Table helper
  const getSelectedTableNum = () => {
    if (selectedTableIds.length === 0) return null;
    const firstId = selectedTableIds[0];
    if (firstId === 'table-1') return { num: '1', seats: '4 Seater' };
    if (firstId === 'table-2') return { num: '2', seats: '4 Seater' };
    if (firstId === 'table-5') return { num: '5', seats: '6 Seater' };
    return { num: '6', seats: '4 Seater' };
  };

  const selectedTable = getSelectedTableNum();

  const handleTableToggle = (tableId) => {
    if (selectedTableIds.includes(tableId)) {
      dispatch(deselectTable(tableId));
    } else {
      dispatch(selectTable(tableId));
    }
  };

  return (
    <View style={styles.container}>
      {/* Absolute Overlay Header with transparent gradient style matching Figma */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <ShareIcon color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. Hero Image Header Block */}
        <View style={styles.heroContainer}>
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
        </View>

        {/* 2. Restaurant Profile Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.restaurantName}>{name || 'Splash Dining Restaurant'}</Text>
          
          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
            <Text style={styles.ratingValueText}>{rating || '4.8'}</Text>
            <TouchableOpacity>
              <Text style={styles.reviewLinkText}>{reviewCount || '5,120'} Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Pricing */}
          <Text style={styles.priceText}>
            From <Text style={styles.boldPrice}>PKR 3,000</Text> Per Person
          </Text>

          <View style={styles.divider} />

          {/* Attribute listings */}
          <View style={styles.attributeRow}>
            <ClocheIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText}>Italian, Continental</Text>
          </View>

          <View style={styles.attributeRow}>
            <PinIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText} numberOfLines={1}>
              {address || '4-A Ali Road Gulberg II, Lahore'}
            </Text>
          </View>

          <View style={styles.attributeRow}>
            <ClockIcon color={Color.textSecondary} size={16} />
            <Text style={styles.attributeText}>Open • Closes 12:00 AM</Text>
          </View>

          <View style={styles.divider} />

          {/* About Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>About Restaurant</Text>
            <Text style={styles.bodyText} numberOfLines={aboutExpanded ? undefined : 3}>
              {about || 'Experience fine dining with a blend of Italian and Continental cuisine. Perfect for family dinners, corporate gatherings, and special occasions.'}
            </Text>
            <TouchableOpacity onPress={() => setAboutExpanded(!aboutExpanded)}>
              <Text style={styles.readMoreText}>{aboutExpanded ? 'Read Less' : 'Read More'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Highlights Section */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightsCard}>
            <Text style={styles.highlightsHeader}>Highlights</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Rooftop & indoor seating available</Text>
              <Text style={styles.bulletPoint}>• Live music on weekends</Text>
              <Text style={styles.bulletPoint}>• Valet parking available</Text>
              {highlightsExpanded && (
                <>
                  <Text style={styles.bulletPoint}>• Private dining for events</Text>
                  <Text style={styles.bulletPoint}>• Buffet options on select holidays</Text>
                </>
              )}
            </View>
            <TouchableOpacity onPress={() => setHighlightsExpanded(!highlightsExpanded)}>
              <Text style={styles.readMoreText}>{highlightsExpanded ? 'Read Less' : 'Read More'}</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={[styles.chip, styles.datePickerBtn]}>
              <View style={styles.datePickerBtnIcon}>
                <CalendarIcon color={Color.textSecondary} size={14} />
              </View>
              <Text style={styles.datePickerBtnText}>Select Date</Text>
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
            <TouchableOpacity style={styles.dropdownChip}>
              <Text style={styles.dropdownChipText}>More ∨</Text>
            </TouchableOpacity>
          </View>

          {/* Special Requests */}
          <Text style={styles.blockTitle}>Special Requests (Optional)</Text>
          <TextInput
            style={styles.requestInput}
            placeholder="Any Special Requests?"
            placeholderTextColor={Color.textMuted}
            value={specialRequests}
            onChangeText={(text) => dispatch(setSpecialRequests(text))}
          />
        </View>

        {/* 5. Live Floor View Section - Canvas rests directly on the page background */}
        <View style={styles.floorPlanBlock}>
          <View style={styles.floorPlanHeaderRow}>
            <View>
              <Text style={styles.blockTitle}>Live Floor View</Text>
              <Text style={styles.floorPlanSubTitle}>Select your preferred table from the live layout</Text>
            </View>
            
            {/* Select Floor Dropdown Button */}
            <TouchableOpacity
              style={styles.selectFloorBtn}
              onPress={() => setShowFloorDropdown(!showFloorDropdown)}
            >
              <Text style={styles.selectFloorBtnText}>Select Floor ∨</Text>
            </TouchableOpacity>
          </View>

          {/* Floor selection dropdown */}
          {showFloorDropdown && (
            <View style={styles.floorDropdown}>
              {['Ground Floor', 'First Floor', 'Rooftop'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={styles.dropdownItem}
                  onPress={() => {
                    dispatch(selectFloor(f === 'Ground Floor' ? '1' : '2'));
                    setShowFloorDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* View Mode controls */}
          <View style={styles.viewModeRow}>
            <TouchableOpacity style={styles.modeBtn}>
              <Text style={styles.modeBtnText}>🖼️ Lounge View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modeBtn}
              onPress={() => navigation.navigate(NavigationPath.LiveFloorView)}
            >
              <Text style={styles.modeBtnText}>⤢ View Full Screen</Text>
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

          {/* Miniature Interactive Floor Plan Canvas without border wrappers */}
          <View style={styles.miniCanvasContainer}>
            <FloorPlanCanvas
              selectedTableIds={selectedTableIds}
              onTablePress={handleTableToggle}
            />
          </View>

          {/* Selected Table details card */}
          {selectedTable && (
            <View style={styles.selectedTableCard}>
              <View style={styles.selectedTableIconBadge}>
                <View style={styles.tableCircleIcon} />
              </View>
              <View style={styles.selectedTableTexts}>
                <Text style={styles.selectedTableTitle}>Table No. {selectedTable.num}</Text>
                <Text style={styles.selectedTableSubTitle}>
                  {selectedTable.seats} • {selectedFloorId === '1' ? 'Ground Floor' : 'First Floor'}
                </Text>
              </View>
              <View style={styles.checkmarkCircle}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
            </View>
          )}

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

        {/* 8. Amenities Grid (Restored) */}
        <View style={styles.amenitiesBlock}>
          <Text style={styles.blockTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {[
              { id: 'a1', label: 'Free Wifi', icon: '📶' },
              { id: 'a2', label: 'Valet Parking', icon: '🚗' },
              { id: 'a3', label: 'Outdoor', icon: '⛱️' },
              { id: 'a4', label: 'Smoking', icon: '🚬' },
              { id: 'a5', label: 'Live Music', icon: '🎵' },
              { id: 'a6', label: 'Wheelchair', icon: '♿' },
              { id: 'a7', label: 'Prayer Area', icon: '🕌' },
              { id: 'a8', label: 'Kids Friendly', icon: '🧒' }
            ].map((am) => (
              <View key={am.id} style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>{am.icon}</Text>
                <Text style={styles.amenityLabel}>{am.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 9. Things to Know & Policies (Restored) */}
        <View style={styles.policiesBlock}>
          <Text style={styles.blockTitle}>Things to Know</Text>
          <View style={styles.policyList}>
            <Text style={styles.policyBullet}>• Smart casual dress code is recommended</Text>
            <Text style={styles.policyBullet}>• Pets are not allowed except certified service animals</Text>
            <Text style={styles.policyBullet}>• Some seating areas may have live music</Text>
            <Text style={styles.policyBullet}>• Window seating is subject to availability</Text>
            <Text style={styles.policyBullet}>• Public holidays may have special menus and pricing</Text>
            <Text style={styles.policyBullet}>• Peak hours may have limited walk-in availability</Text>
          </View>

          <View style={styles.spacer} />

          <Text style={styles.blockTitle}>Reservation Policy</Text>
          <View style={styles.policyList}>
            <Text style={styles.policyBullet}>• Please arrive within 15 minutes of your reserved time</Text>
            <Text style={styles.policyBullet}>• Tables will be held for up to 15 minutes after the reservation time</Text>
            <Text style={styles.policyBullet}>• Outside food and beverages are not permitted</Text>
            <Text style={styles.policyBullet}>• Management reserves the right to reassign tables when necessary</Text>
            <Text style={styles.policyBullet}>• Large group reservations may require advance confirmation</Text>
          </View>
        </View>

        {/* 10. Reviews Block (Restored) */}
        <View style={styles.reviewsBlock}>
          <Text style={styles.blockTitle}>Reviews</Text>
          <View style={styles.reviewsSummaryCard}>
            <Text style={styles.ratingBigText}>4.8/5</Text>
            <Text style={styles.reviewSubText}>5,120 Reviews</Text>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeaderRow}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.avatarInitial}>C</Text>
              </View>
              <View>
                <Text style={styles.reviewerName}>Customer</Text>
                <Text style={styles.reviewDate}>06/01/2022</Text>
              </View>
            </View>
            <Text style={styles.reviewStars}>★ ★ ★ ★ ★</Text>
            <Text style={styles.reviewComment}>
              Location is apart but if you rent a car & would like to have home stay experiencing, it's absolutely the good choice! Joyuam is easy reachable by Car GPS! Host is
            </Text>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(21, 82, 179, 0.25)', // Subtle blue shadow overlay
    height: 60,
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
  },
  headerTitle: {
    color: Color.white,
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
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
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.large,
  },
  highlightsHeader: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: Constants.spacing.small,
  },
  bulletList: {
    marginBottom: Constants.spacing.small,
  },
  bulletPoint: {
    fontSize: Constants.fontSize.body,
    color: '#78350F',
    marginBottom: Constants.spacing.tiny,
    lineHeight: 20,
  },
  bookingDetailsBlock: {
    backgroundColor: Color.surface,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  blockTitle: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.medium,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Constants.spacing.large,
  },
  chip: {
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    marginRight: Constants.spacing.small,
    marginBottom: Constants.spacing.small,
    backgroundColor: Color.surface,
  },
  chipSelected: {
    borderColor: Color.headerBlue,
    backgroundColor: 'rgba(21, 82, 179, 0.05)',
  },
  chipText: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
  },
  chipTextSelected: {
    color: Color.headerBlue,
    fontWeight: 'bold',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerBtnIcon: {
    marginRight: 6,
  },
  datePickerBtnText: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    fontWeight: 'bold',
  },
  dropdownChip: {
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    justifyContent: 'center',
  },
  dropdownChipText: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
  },
  requestInput: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    paddingHorizontal: Constants.spacing.medium,
    height: 48,
    color: Color.textPrimary,
  },
  floorPlanBlock: {
    backgroundColor: Color.surface,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  floorPlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Constants.spacing.small,
  },
  floorPlanSubTitle: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginTop: -8,
    marginBottom: Constants.spacing.small,
  },
  selectFloorBtn: {
    backgroundColor: Color.headerBlue,
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
    borderRadius: Constants.borderRadius.medium,
  },
  selectFloorBtnText: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.bodySmall,
  },
  floorDropdown: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.small,
    position: 'absolute',
    right: Constants.spacing.large,
    top: 55,
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: Constants.spacing.small,
    paddingHorizontal: Constants.spacing.medium,
  },
  dropdownItemText: {
    color: Color.textPrimary,
    fontSize: Constants.fontSize.body,
  },
  viewModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Constants.spacing.medium,
  },
  modeBtn: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.medium,
    paddingVertical: Constants.spacing.small,
    alignItems: 'center',
  },
  modeBtnText: {
    color: Color.textSecondary,
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Constants.spacing.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Constants.spacing.medium,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: Constants.fontSize.bodySmall,
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
    backgroundColor: 'rgba(46, 204, 113, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.medium,
    marginBottom: Constants.spacing.large,
  },
  tableCircleIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Color.available,
  },
  selectedTableIconBadge: {
    marginRight: Constants.spacing.medium,
  },
  selectedTableTexts: {
    flex: 1,
  },
  selectedTableTitle: {
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  selectedTableSubTitle: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginTop: 2,
  },
  checkmarkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Color.available,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: 14,
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
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.large,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: Constants.spacing.large,
  },
  amenityIcon: {
    fontSize: 22,
    marginBottom: Constants.spacing.tiny,
  },
  amenityLabel: {
    fontSize: 10,
    color: Color.textSecondary,
    textAlign: 'center',
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
    padding: Constants.spacing.large,
  },
  reviewsSummaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: Constants.borderRadius.medium,
    padding: Constants.spacing.large,
    alignItems: 'center',
    marginBottom: Constants.spacing.large,
  },
  ratingBigText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  reviewSubText: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    marginTop: Constants.spacing.tiny,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
    paddingVertical: Constants.spacing.medium,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Constants.spacing.small,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 82, 179, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Constants.spacing.medium,
  },
  avatarInitial: {
    color: Color.headerBlue,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.body,
  },
  reviewerName: {
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  reviewDate: {
    fontSize: 10,
    color: Color.textSecondary,
  },
  reviewStars: {
    color: Color.starColor,
    fontSize: 12,
    marginBottom: Constants.spacing.tiny,
  },
  reviewComment: {
    fontSize: Constants.fontSize.bodySmall,
    color: Color.textSecondary,
    lineHeight: 18,
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
