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
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import * as Lucide from 'lucide-react-native';
import moment from 'moment';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import Images from '../../common/Images';
import NavigationPath from '../../navigation/NavigationPath';

import { FloorPlanCanvas } from '../../components/canvas/FloorPlanCanvas';
import DatePickerModal from '../BookTable/DatePickerModal';
import TimeSlotSelectModal from '../BookTable/TimeSlotSelectModal';
import BottomSheet from '../BottomSheet/NewGorhomBS';
import CalenderComponent from '../SearchRestaurant/components/CalenderComponent';

import { getRestaurantDetails } from '../../redux/restaurant';
import {
  setSelectedDate,
  setSelectedTimeSlot,
  setSpecialRequests,
  setGuestCount,
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
// Premium Lucide Icon wrappers matching screen layouts
const ClockIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <Lucide.Clock color={color} size={size} strokeWidth={2} />
);

const PinIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <Lucide.MapPin color={color} size={size} strokeWidth={2} />
);

const ClocheIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <Lucide.UtensilsCrossed color={color} size={size} strokeWidth={2} />
);

const ShareIcon = ({ color = '#FFF', size = 20 }) => (
  <Lucide.Share2 color={color} size={size} strokeWidth={2} />
);

const LandscapeIcon = ({ color = '#FFF', size = 16 }) => (
  <Lucide.Image color={color} size={size} strokeWidth={2} />
);

const CalendarIcon = ({ color = Color.textSecondary, size = 16 }) => (
  <Lucide.Calendar color={color} size={size} strokeWidth={2} />
);

const HighChairIcon = ({ color = Color.textPrimary, size = 28 }) => (
  <Lucide.Baby color={color} size={size} strokeWidth={2} />
);

const WheelchairIcon = ({ color = Color.textPrimary, size = 28 }) => (
  <Lucide.Accessibility color={color} size={size} strokeWidth={2} />
);

// Amenity Icons using Lucide premium icons
const WifiIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Wifi color={color} size={size} strokeWidth={1.8} />
);

const ValetIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Car color={color} size={size} strokeWidth={1.8} />
);

const OutdoorIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Sun color={color} size={size} strokeWidth={1.8} />
);

const SmokingIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Cigarette color={color} size={size} strokeWidth={1.8} />
);

const MusicIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Music color={color} size={size} strokeWidth={1.8} />
);

const WheelchairIconSmall = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Accessibility color={color} size={size} strokeWidth={1.8} />
);

const PrayerIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Heart color={color} size={size} strokeWidth={1.8} />
);

const KidsIcon = ({ color = '#1E2937', size = 28 }) => (
  <Lucide.Smile color={color} size={size} strokeWidth={1.8} />
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

const PencilIcon = ({ color = '#FFF', size = 14 }) => (
  <Lucide.Pencil color={color} size={size} strokeWidth={2.2} />
);

// Dynamic amenity icon resolver to automatically match any new amenities to appropriate Lucide icons
const getAmenityIcon = (amenityName, color, size) => {
  const name = amenityName.toLowerCase();

  // 1. Core manual premium mappings
  if (name.includes('wifi')) return <WifiIcon color={color} size={size} />;
  if (name.includes('valet') || name.includes('parking')) return <ValetIcon color={color} size={size} />;
  if (name.includes('outdoor')) return <OutdoorIcon color={color} size={size} />;
  if (name.includes('smoking')) return <SmokingIcon color={color} size={size} />;
  if (name.includes('music')) return <MusicIcon color={color} size={size} />;
  if (name.includes('wheelchair') || name.includes('accessible')) return <WheelchairIconSmall color={color} size={size} />;
  if (name.includes('prayer')) return <PrayerIcon color={color} size={size} />;
  if (name.includes('kids') || name.includes('play')) return <KidsIcon color={color} size={size} />;

  // 2. Dynamic check: parse each word in amenityName to see if it matches any Lucide icon component name
  const words = name.split(/[\s-_]+/);
  for (const word of words) {
    if (word.length < 3) continue;
    // Capitalize word (e.g. "coffee" -> "Coffee", "beer" -> "Beer") to match Lucide export names
    const pascalWord = word.charAt(0).toUpperCase() + word.slice(1);
    if (Lucide[pascalWord]) {
      const IconComponent = Lucide[pascalWord];
      return <IconComponent color={color} size={size} strokeWidth={1.8} />;
    }
  }

  // 3. Fallback standard checkmark icon for unidentified amenities
  return <Lucide.Check color={color} size={size} strokeWidth={2.2} />;
};

const CustomSwitch = ({ value, onValueChange }) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#85B9F6', '#0B4FA4'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onValueChange}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          backgroundColor: backgroundColor,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX: toggleTranslate }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1.5 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const DashedDivider = () => (
  <View style={styles.dashedDividerContainer}>
    <View style={styles.dashedDivider} />
  </View>
);

const RestaurantDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const isManualScroll = useRef(false);

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [containerHeight, setContainerHeight] = useState(0);

  // Animation state for sliding tab bar header
  const translateYAnim = useRef(new Animated.Value(-100)).current;
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 220],
    outputRange: ['rgba(11, 79, 164, 0)', Color.headerBlue],
    extrapolate: 'clamp',
  });

  const stickyTriggerPoint = 250 - (56 + insets.top);

  const stickyOpacity = scrollY.interpolate({
    inputRange: [stickyTriggerPoint - 1, stickyTriggerPoint],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyTranslateY = scrollY.interpolate({
    inputRange: [stickyTriggerPoint - 1, stickyTriggerPoint],
    outputRange: [-150, 0],
    extrapolate: 'clamp',
  });

  const { restaurantId } = route.params || {};

  // Redux Selectors
  const { selectedRestaurant, loading, error } = useSelector((state) => state.restaurant);
  const { selectedDate, selectedTimeSlot, specialRequests, guestCount } = useSelector((state) => state.booking);
  const { selectedFloorId, selectedTableIds, joinTables, additionalNeeds, floors, tablesByFloor } = useSelector((state) => state.tables);

  const dateBottomSheetRef = useRef(null);
  const guestsBottomSheetRef = useRef(null);

  // Local States
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchHeaderTranslateY = useRef(new Animated.Value(-260)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const openSearchHeader = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchHeaderTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeSearchHeader = () => {
    Animated.parallel([
      Animated.timing(searchHeaderTranslateY, {
        toValue: -260,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsSearchExpanded(false);
    });
  };

  // Layout positions for scrolling
  const [sectionLayouts, setSectionLayouts] = useState({
    overview: -1,
    selectdate: -1,
    liveview: -1,
    menu: -1,
  });

  const handleLayout = (sectionName) => (event) => {
    const { y } = event.nativeEvent.layout;
    setSectionLayouts((prev) => ({ ...prev, [sectionName]: y }));
  };

  // Calculate dynamic bottom padding so that the last section (Menu) can scroll to the top,
  // but we do NOT leave any blank space below the last element when reaching the bottom.
  const headerHeight = 56 + insets.top;
  const tabBarHeight = 48;
  const destMenuY = 266 + sectionLayouts.menu - headerHeight - tabBarHeight - 40;
  const baseContentHeight = 266 + containerHeight;
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  let dynamicBottomPadding = 40; // Default baseline padding
  if (sectionLayouts.menu >= 0 && containerHeight > 0) {
    const requiredHeight = destMenuY + SCREEN_HEIGHT;
    if (requiredHeight > baseContentHeight) {
      dynamicBottomPadding = requiredHeight - baseContentHeight;
    }
  }

  const scrollToSection = (sectionName) => {
    let layoutKey = 'overview';
    if (sectionName === 'Select Date') layoutKey = 'selectdate';
    else if (sectionName === 'Live View') layoutKey = 'liveview';
    else if (sectionName === 'Menu') layoutKey = 'menu';

    const targetY = sectionLayouts[layoutKey];
    if (targetY !== undefined && scrollViewRef.current) {
      const headerHeight = 56 + insets.top;
      const tabBarHeight = 48;

      const absoluteTargetY = 266 + targetY;
      const destY = Math.max(0, absoluteTargetY - headerHeight - tabBarHeight - 40);

      // Disable manual scroll active tab updates during programmatic scroll
      isManualScroll.current = false;
      setActiveTab(sectionName);

      scrollViewRef.current.scrollTo({
        y: destY,
        animated: true,
      });
    }
  };

  // Fetch details, floors, and tables on mount
  useEffect(() => {
    const targetId = restaurantId || '00000000-0000-7000-8000-000000000030';
    if (!selectedRestaurant || selectedRestaurant.id !== targetId) {
      dispatch(getRestaurantDetails(targetId));
    }
    if (!selectedDate) {
      dispatch(setSelectedDate(moment().format('YYYY-MM-DD')));
    }
  }, [dispatch, restaurantId, selectedRestaurant, selectedDate]);

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
    images,
  } = selectedRestaurant;

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

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.setValue(y);

    // Toggle sticky tab bar visibility instantly
    const trigger = 250 - (56 + insets.top);
    if (y >= trigger) {
      if (!isStickyVisible) {
        setIsStickyVisible(true);
      }
    } else {
      if (isStickyVisible) {
        setIsStickyVisible(false);
      }
    }

    // Scroll to end check - hides "Select Room" button on reach
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isCloseToBottom && showBottomBar) {
      setShowBottomBar(false);
    } else if (!isCloseToBottom && !showBottomBar) {
      setShowBottomBar(true);
    }

    // Scroll active tab detection (Overview, Select Date, Live View, Menu)
    // Only detect/update active tabs if the user is scrolling manually (dragging or momentum gliding)
    if (isManualScroll.current) {
      if (sectionLayouts.selectdate >= 0 || sectionLayouts.liveview >= 0) {
        const headerHeight = 56 + insets.top;
        const tabBarHeight = 48;
        const triggerPoint = y + headerHeight + tabBarHeight + 40; // 1 cm below sticky header bottom

        if (sectionLayouts.menu >= 0 && triggerPoint >= 266 + sectionLayouts.menu) {
          setActiveTab('Menu');
        } else if (sectionLayouts.liveview >= 0 && triggerPoint >= 266 + sectionLayouts.liveview) {
          setActiveTab('Live View');
        } else if (sectionLayouts.selectdate >= 0 && triggerPoint >= 266 + sectionLayouts.selectdate) {
          setActiveTab('Select Date');
        } else {
          setActiveTab('Overview');
        }
      } else {
        setActiveTab('Overview');
      }
    }
  };

  const renderTabBar = (isSticky = false) => {
    const tabs = ['Overview', 'Select Date', 'Live View', 'Menu'];
    return (
      <View style={[styles.tabBar, isSticky && styles.tabBarSticky]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => scrollToSection(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Safe formatting for header date
  const displayDateText = selectedDate
    ? moment(selectedDate, 'YYYY-MM-DD').format('DD MMM')
    : moment().format('DD MMM');

  const displayFullDateRangeText = selectedDate
    ? moment(selectedDate, 'YYYY-MM-DD').format('DD MMM YYYY')
    : moment().format('DD MMM YYYY');

  const backdropTranslateY = backdropOpacity.interpolate({
    inputRange: [0, 0.01, 1],
    outputRange: [SCREEN_HEIGHT, 0, 0],
  });

  return (
    <View style={styles.container}>
      {/* Absolute Overlay Header with smooth animated color transition */}
      <Animated.View style={[styles.headerOverlay, { paddingTop: insets.top + 10, height: 68 + insets.top, backgroundColor: Color.headerBlue, paddingBottom: 10 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Lucide.ChevronLeft color={Color.white} size={28} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Dynamic Edit/Search Bar matching Figma */}
        <TouchableOpacity
          style={styles.headerSearchSelector}
          onPress={openSearchHeader}
        >
          <Text style={styles.headerSearchText}>
            {displayDateText} | 2 Guests
          </Text>
          <PencilIcon color="#FFF" size={14} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerBtn}>
          <ShareIcon color="#FFF" size={20} />
        </TouchableOpacity>
      </Animated.View>



      {/* Floating Sticky Tab Bar overlay */}
      <Animated.View style={{
        position: 'absolute',
        top: 56 + insets.top,
        left: 0,
        right: 0,
        zIndex: 10,
        opacity: stickyOpacity,
        transform: [{ translateY: stickyTranslateY }],
      }}>
        {renderTabBar(true)}
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: dynamicBottomPadding }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          isManualScroll.current = true;
        }}
        onScrollEndDrag={() => {
          // Reset manual scroll flag with a minor delay if no momentum occurs
          setTimeout(() => {
            isManualScroll.current = false;
          }, 150);
        }}
        onMomentumScrollEnd={() => {
          isManualScroll.current = false;
        }}
      >
        {/* 1. Hero Image Header Block */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setImageModalVisible(true)}
          style={styles.heroContainer}
        >
          <Image
            source={{ uri: (images && images.length > 0) ? images[0] : Images.placeholders.restaurant }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Photo Count Badge exactly matching screenshots: 1/{total} */}
          <View style={styles.photoCountBadge}>
            <LandscapeIcon color="#FFF" size={14} />
            <Text style={styles.photoCountText}>1/{images?.length || 1}</Text>
          </View>
        </TouchableOpacity>

        {/* Unified content container w/ margin from top, bottom & sides matching screenshot */}
        <View onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)} style={styles.mainContentContainer}>

          {/* Overview / Info Section */}
          <View onLayout={handleLayout('overview')}>
            <Text style={styles.restaurantName}>{name || 'Splash Dining Restaurant'}</Text>

            {/* Rating Stars Row */}
            <View style={styles.ratingRow}>
              <Text style={styles.starText}>★ ★ ★ ★ ★</Text>
              <TouchableOpacity>
                <Text style={styles.reviewLinkText}>
                  {reviewCount ? `${reviewCount} Reviews` : 'No Reviews'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address */}
            <Text style={styles.addressText}>{address || 'Not Available'}</Text>

            {/* Premium Exceptional Review Badge Row */}
            <View style={styles.badgeRow}>
              <View style={styles.exceptionalBadge}>
                <Text style={styles.exceptionalBadgeText}>5</Text>
              </View>
              <Text style={styles.exceptionalText}>Exceptional</Text>
              <View style={styles.badgeVerticalLine} />
              <Text style={styles.badgeReviewsText}>
                {reviewCount ? `(${reviewCount}) Reviews` : '(2) Reviews'}
              </Text>
            </View>

            <DashedDivider />

            {/* Section: Overview/About text */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeader}>Overview</Text>
              <Text style={styles.bodyText} numberOfLines={aboutExpanded ? undefined : 3}>
                {about || 'Not Available'}
              </Text>
              {about && (
                <TouchableOpacity onPress={() => setAboutExpanded(!aboutExpanded)}>
                  <Text style={styles.readMoreText}>{aboutExpanded ? 'Read Less' : 'Read More'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Section: Pricing & Timing Info */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.attributeRow}>
                <ClocheIcon color={Color.textSecondary} size={16} />
                <Text style={styles.attributeText}>
                  {selectedRestaurant.cuisineTags ? selectedRestaurant.cuisineTags.join(', ') : 'Not Available'}
                </Text>
              </View>
              <View style={styles.attributeRow}>
                <ClockIcon color={Color.textSecondary} size={16} />
                <Text style={styles.attributeText}>{hours ? `Open • ${hours}` : 'Not Available'}</Text>
              </View>
            </View>
          </View>

          <DashedDivider />

          {/* Amenities checklist with green checkmarks */}
          <View onLayout={handleLayout('amenities')} style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Amenities</Text>
            {selectedRestaurant.amenities && selectedRestaurant.amenities.length > 0 ? (
              <View style={styles.amenitiesCheckList}>
                {selectedRestaurant.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityCheckItem}>
                    <View style={{ marginRight: 8, width: 20, alignItems: 'center', justifyContent: 'center' }}>
                      {getAmenityIcon(amenity, '#1E2937', 18)}
                    </View>
                    <Text style={styles.amenityCheckText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.bodyText}>• Not Available</Text>
            )}
          </View>

          <DashedDivider />

          {/* Rooms / Tables Slot Selector Section */}
          {/* Dynamic slot date & time selector */}
          <View onLayout={handleLayout('selectdate')} style={styles.bookingDetailsBlock}>
            <Text style={styles.sectionHeader}>Select Your Table</Text>

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

            {/* Date & Time Picker Modals */}
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
            <TimeSlotSelectModal
              visible={showTimePicker}
              onClose={() => setShowTimePicker(false)}
              initialSlot={selectedTimeSlot}
              onConfirm={(slot) => {
                dispatch(setSelectedTimeSlot(slot));
              }}
            />
          </View>

          {/* Live Floor View Block */}
          <View onLayout={handleLayout('liveview')} style={styles.floorPlanInnerBlock}>
            <View style={styles.floorPlanHeaderRow}>
              <Text style={styles.floorPlanTitle}>Live Floor View</Text>
              <TouchableOpacity
                style={styles.selectFloorBtn}
                onPress={() => setShowFloorDropdown(!showFloorDropdown)}
              >
                <Text style={styles.selectFloorBtnText}>
                  {activeFloor ? (activeFloor.nameI18n?.en || activeFloor.name) : 'Select Floor'}
                </Text>
                <View style={styles.selectFloorChevron}>
                  <Lucide.ChevronDown color={Color.white} size={10} strokeWidth={3} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.floorPlanSubTitle}>Select your preferred table from the live layout</Text>

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

            {/* Interactive Floor View Controls */}
            <View style={styles.viewModeRow}>
              <TouchableOpacity style={styles.modeBtn}>
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
                <View style={styles.expandIcon}>
                  <View style={[styles.expandArrow, styles.expandArrowTL]} />
                  <View style={[styles.expandArrow, styles.expandArrowBR]} />
                </View>
                <Text style={styles.modeBtnText}>View Full Screen</Text>
              </TouchableOpacity>
            </View>

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

            {/* Canvas Layout wrapper */}
            <View style={styles.miniCanvasContainer}>
              <FloorPlanCanvas
                tables={(selectedFloorId && tablesByFloor && tablesByFloor[selectedFloorId]) || []}
                selectedTableIds={selectedTableIds}
                onTablePress={handleTableToggle}
                canvasMeta={activeFloor?.canvasMeta}
              />
            </View>

            {/* Selected table summary cards */}
            {selectedTableIds.length > 0 && (
              <>
                <Text style={styles.selectedTableHeader}>Selected Table{selectedTableIds.length > 1 ? 's' : ''}</Text>
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
                        <Text style={styles.selectedTableSubTitle}>{tableInfo.seats} • {floorLabel}</Text>
                      </View>
                      <View style={styles.checkmarkCircle}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                    </View>
                  );
                })}
              </>
            )}

            {/* Join tables switch */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Would you like to join the selected tables</Text>
              <CustomSwitch
                value={joinTables}
                onValueChange={() => dispatch(toggleJoinTables())}
              />
            </View>
          </View>

          {/* Additional baby chairs / wheelchairs */}
          <View style={styles.additionalNeedsInnerBlock}>
            <Text style={styles.blockTitle}>Additional Needs</Text>

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
              <CustomSwitch
                value={additionalNeeds.wheelchair}
                onValueChange={() => dispatch(toggleWheelchair())}
              />
            </View>
          </View>

          {/* Popular Menu section */}
          <View onLayout={handleLayout('menu')} style={styles.menuInnerBlock}>
            <View style={styles.blockHeaderRow}>
              <Text style={styles.blockTitle}>Popular Menu</Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => navigation.navigate(NavigationPath.Menu, { restaurantId })}
              >
                <Text style={styles.viewFullMenuText}>View Full Menu </Text>
                <Lucide.ChevronRight color={Color.headerBlue} size={14} strokeWidth={2.5} />
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

          {/* Special Request Optional Field */}
          <View style={{ marginTop: 16 }}>
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

          <DashedDivider />

          {/* Things to Know and Reservation Policies */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Things to Know</Text>
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

            <Text style={styles.sectionHeader}>Reservation Policy</Text>
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

          <DashedDivider />

          {/* Section: Reviews list */}
          <View onLayout={handleLayout('reviews')} style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Reviews</Text>
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
            source={{ uri: (images && images.length > 0) ? images[0] : Images.placeholders.restaurant }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Sticky Bottom Bar exactly matching screenshot */}
      {showBottomBar && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={styles.reserveBtn}
            onPress={() => navigation.navigate(NavigationPath.DateTimeSelect, { restaurantId: selectedRestaurant?.id })}
          >
            <Text style={styles.reserveBtnText}>Select Room</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Light black semi-transparent backdrop overlay cover */}
      <Animated.View 
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          opacity: backdropOpacity,
          transform: [{ translateY: backdropTranslateY }],
          zIndex: 98,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSearchHeader}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Sliding Expanded Search Header Panel */}
      <Animated.View style={[
        styles.headerOverlay, 
        { 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top, 
          height: 176 + insets.top, 
          backgroundColor: Color.headerBlue,
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          transform: [{ translateY: searchHeaderTranslateY }],
          zIndex: 99,
          paddingBottom: 16,
        }
      ]}>
        {/* Top Row: Back arrow, Title, Country selection */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
          <TouchableOpacity style={styles.headerBtn} onPress={closeSearchHeader}>
            <Lucide.ChevronLeft color={Color.white} size={28} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: Color.white, fontSize: 18, fontWeight: '700', fontFamily: Constants.fontFamilyBold || 'System' }}>
            Search Restaurant
          </Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 4 }}>
            <Text style={{ color: Color.white, fontSize: 13, marginRight: 4, fontFamily: Constants.fontFamilyMedium || 'System' }}>Pakistan</Text>
            <Lucide.ChevronDown color={Color.white} size={14} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Date Selection Box */}
        <TouchableOpacity 
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
            borderRadius: 8,
            height: 42,
            paddingHorizontal: 12,
            marginTop: 6,
          }}
          onPress={() => {
            dateBottomSheetRef.current?.open();
          }}
        >
          <Lucide.Calendar color={Color.white} size={18} strokeWidth={2} style={{ marginRight: 8 }} />
          <Text style={{ color: Color.white, fontSize: 14, fontFamily: Constants.fontFamilyMedium || 'System' }}>
            {displayFullDateRangeText}
          </Text>
        </TouchableOpacity>

        {/* Guest Selection Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
              borderRadius: 8,
              height: 42,
              paddingHorizontal: 12,
              marginRight: 10,
            }}
            onPress={() => {
              guestsBottomSheetRef.current?.open();
            }}
          >
            <Lucide.Users color={Color.white} size={18} strokeWidth={2} style={{ marginRight: 8 }} />
            <Text style={{ color: Color.white, fontSize: 14, fontFamily: Constants.fontFamilyMedium || 'System' }}>
              {guestCount} Guests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              backgroundColor: Color.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              closeSearchHeader();
              dispatch(getTables(restaurantId || '00000000-0000-7000-8000-000000000030', selectedDate, selectedTimeSlot));
            }}
          >
            <Lucide.Search color={Color.headerBlue} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Date Selection Calendar Bottom Sheet Modal */}
      <BottomSheet isBottomSafeArea={true} refRBSheet={dateBottomSheetRef}>
        <CalenderComponent
          isBus={false}
          oneWay={1}
          departureDate={selectedDate}
          selectedDate={depDate => {
            const formatted = moment(depDate, 'DD MMM, YYYY').format('YYYY-MM-DD');
            dispatch(setSelectedDate(formatted));
            dateBottomSheetRef.current?.close();
          }}
        />
      </BottomSheet>

      {/* Guests Selection Bottom Sheet Modal */}
      <BottomSheet isBottomSafeArea={false} refRBSheet={guestsBottomSheetRef}>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Select No. of Guests</Text>
          <View style={styles.sheetRow}>
            <Text style={styles.sheetLabel}>Guests</Text>
            <View style={styles.sheetStepper}>
              <TouchableOpacity
                style={styles.sheetStepperBtn}
                onPress={() => dispatch(setGuestCount(Math.max(1, guestCount - 1)))}>
                <Lucide.Minus size={16} strokeWidth={2.5} color="#4B5563" />
              </TouchableOpacity>
              <Text style={styles.sheetStepperVal}>{guestCount}</Text>
              <TouchableOpacity
                style={styles.sheetStepperBtn}
                onPress={() => dispatch(setGuestCount(guestCount + 1))}>
                <Lucide.Plus size={16} strokeWidth={2.5} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sheetNextBtn}
            onPress={() => guestsBottomSheetRef.current?.close()}>
            <Text style={styles.sheetNextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
    zIndex: 11,
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
  headerSearchSelector: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
  headerSearchText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  headerSearchPencil: {
    color: '#FFF',
    fontSize: 12,
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
    bottom: 16,
    right: Constants.spacing.medium,
    backgroundColor: 'rgba(21, 82, 179, 0.75)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCountText: {
    color: Color.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabBar: {
    height: 48,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 9,
  },
  tabBarSticky: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1552B3',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2.5,
    backgroundColor: '#1552B3',
    borderRadius: 1,
  },
  mainContentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16, // reduced bottom margin
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  restaurantName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starText: {
    color: Color.starColor,
    fontSize: 13,
    marginRight: 6,
  },
  reviewLinkText: {
    fontSize: 13,
    color: Color.textSecondary,
    textDecorationLine: 'none',
  },
  addressText: {
    fontSize: 14,
    color: Color.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exceptionalBadge: {
    backgroundColor: '#1552B3',
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  exceptionalBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  exceptionalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1552B3',
  },
  badgeVerticalLine: {
    width: 1,
    height: 14,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  badgeReviewsText: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  dashedDividerContainer: {
    marginVertical: 18,
    overflow: 'hidden',
  },
  dashedDivider: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginTop: -1,
  },
  sectionBlock: {
    marginTop: Constants.spacing.tiny,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: Color.textSecondary,
    lineHeight: 21,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.headerBlue,
    marginTop: 8,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeText: {
    fontSize: 14,
    color: Color.textSecondary,
    marginLeft: 8,
  },
  amenitiesCheckList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenityCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  checkmarkGreen: {
    color: '#2ECC71',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  amenityCheckText: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  mapContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinRedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E74C3C',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bookingDetailsBlock: {
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 10,
    marginTop: 12,
  },
  blockTitleWithOptional: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 10,
    marginTop: 12,
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: Color.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
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
  floorPlanInnerBlock: {
    marginVertical: 12,
  },
  floorPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  floorPlanSubTitle: {
    fontSize: 13,
    color: Color.textSecondary,
    marginBottom: 12,
  },
  floorPlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectFloorBtn: {
    backgroundColor: Color.headerBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectFloorBtnText: {
    color: Color.white,
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
  selectFloorChevron: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectFloorChevronText: {
    color: Color.white,
    fontSize: 9,
    marginTop: -1,
  },
  floorDropdown: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 12,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
    top: 40,
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
    marginTop: 8,
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
    fontSize: 15,
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
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
    flex: 0.8,
  },
  additionalNeedsInnerBlock: {
    marginVertical: 12,
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
  menuInnerBlock: {
    marginVertical: 16,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Constants.spacing.medium,
  },
  viewFullMenuText: {
    color: Color.headerBlue,
    fontWeight: 'bold',
    fontSize: Constants.fontSize.bodySmall,
  },
  horizontalMenuContent: {
    paddingRight: Constants.spacing.large,
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
  reserveBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Color.white,
  },
  sheetTitle: {
    fontSize: 17,
    fontFamily: Constants.fontFamilyBold,
    fontWeight: '700',
    color: '#1E2937',
    marginBottom: 16,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetLabel: {
    fontSize: 15,
    fontFamily: Constants.fontFamilyMedium,
    color: '#4B5563',
    fontWeight: '500',
  },
  sheetStepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetStepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  sheetStepperVal: {
    fontSize: 16,
    fontFamily: Constants.fontFamilyMedium,
    fontWeight: '600',
    color: '#1E2937',
    marginHorizontal: 16,
  },
  sheetNextBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Color.headerBlue,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sheetNextBtnText: {
    color: Color.white,
    fontSize: 16,
    fontFamily: Constants.fontFamilyMedium,
    fontWeight: '600',
  },
});

export default RestaurantDetailsScreen;
