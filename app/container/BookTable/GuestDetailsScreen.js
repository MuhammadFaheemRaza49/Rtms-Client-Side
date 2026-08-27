import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Lucide from 'lucide-react-native';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';
import BackIconComponent from '../ComponentsV2/ComponentsV2/BackIconComponent';

const CustomSwitch = ({ value, onValueChange }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
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

export default function GuestDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  // Form states
  const [salutation, setSalutation] = useState('Mr'); // 'Mr', 'Mrs', 'Miss'
  const [fullName, setFullName] = useState('');
  const [idType, setIdType] = useState('National ID'); // 'National ID', 'Passport Number'
  const [idNumber, setIdNumber] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    navigation.navigate(NavigationPath.ReviewDetails, {
      restaurantId: activeBranchId,
      guestInfo: {
        salutation,
        fullName,
        idType,
        idNumber,
        saveForFuture,
      },
    });
  };

  const isFormValid = fullName.trim().length > 0 && idNumber.trim().length > 0;
  const idPlaceholder = idType === 'National ID' ? '12345-6789012-3' : 'e.g. AB1234567';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10, paddingBottom: 16 }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack}>
              <BackIconComponent color={Color.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Passenger Details</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Form Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Passenger Details</Text>
              <TouchableOpacity style={styles.friendsBtn}>
                <Lucide.Settings color="#0B4FA4" size={14} style={{ marginRight: 4 }} />
                <Text style={styles.friendsBtnText}>Friends & Family</Text>
              </TouchableOpacity>
            </View>

            {/* Salutation Radios */}
            <View style={styles.radioGroupRow}>
              {['Mr', 'Mrs', 'Miss'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setSalutation(option)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, salutation === option && styles.radioCircleActive]}>
                    {salutation === option && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Full Name Field */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Lucide.User color="#94A3B8" size={18} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter Full Name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* ID Type Radios */}
            <View style={styles.radioGroupRow}>
              {['National ID', 'Passport Number'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setIdType(option)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, idType === option && styles.radioCircleActive]}>
                    {idType === option && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ID Number Field */}
            <Text style={styles.inputLabel}>{idType}</Text>
            <View style={styles.inputContainer}>
              <Lucide.FileText color="#94A3B8" size={18} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                value={idNumber}
                onChangeText={setIdNumber}
                placeholder={idPlaceholder}
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>

            {/* Save Switch */}
            <View style={styles.switchRow}>
              <CustomSwitch
                value={saveForFuture}
                onValueChange={() => setSaveForFuture(!saveForFuture)}
              />
              <Text style={styles.switchLabel}>Save Details for future use</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.proceedBtn, !isFormValid && styles.proceedBtnDisabled]}
            disabled={!isFormValid}
            onPress={handleProceed}
          >
            <Text style={styles.proceedBtnText}>Review Booking</Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  friendsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  friendsBtnText: {
    fontSize: 11,
    color: '#0B4FA4',
    fontWeight: '600',
  },
  radioGroupRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: '#0B4FA4',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B4FA4',
  },
  radioText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
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
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  switchLabel: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
    fontWeight: '500',
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
  },
  proceedBtn: {
    backgroundColor: '#0B4FA4',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  proceedBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
