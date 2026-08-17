import React from 'react';
import {
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
import NavigationPath from '../../navigation/NavigationPath';

import { setSpecialRequests } from '../../redux/booking';
import {
  setHighChairCount,
  toggleWheelchair,
} from '../../redux/tables';

export default function AdditionalNeedsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { specialRequests } = useSelector((state) => state.booking);
  const { additionalNeeds } = useSelector((state) => state.tables);
  const { highChairCount, wheelchair } = additionalNeeds || { highChairCount: 0, wheelchair: false };

  const handleProceed = () => {
    navigation.navigate(NavigationPath.ReviewDetails, { restaurantId: activeBranchId });
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
          <Text style={styles.headerTitle}>Additional Needs</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* High Chair Stepper */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>High Chairs</Text>
              <Text style={styles.cardDesc}>Request high chairs for infants or toddlers</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setHighChairCount(Math.max(0, highChairCount - 1)))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{highChairCount}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(setHighChairCount(highChairCount + 1))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Wheelchair Access Switch */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Wheelchair Accessibility</Text>
              <Text style={styles.cardDesc}>Ensure easy-access seating and ramps</Text>
            </View>
            <Switch
              value={wheelchair}
              onValueChange={() => dispatch(toggleWheelchair())}
              trackColor={{ false: Color.border, true: Color.headerBlue }}
              thumbColor={Color.white}
            />
          </View>
        </View>

        {/* Special Requests Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Special Requests</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={specialRequests}
            onChangeText={(text) => dispatch(setSpecialRequests(text))}
            placeholder="Add any specific requirements (e.g., birthday setup, allergies, table preferences)..."
            placeholderTextColor={Color.textMuted}
            style={styles.textArea}
          />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedBtnText}>Proceed to Review</Text>
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: Constants.spacing.medium,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: Color.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  stepperVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginHorizontal: Constants.spacing.medium,
  },
  inputCard: {
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.medium,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Constants.spacing.large,
    marginBottom: Constants.spacing.medium,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: Constants.spacing.small,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Constants.borderRadius.small,
    backgroundColor: Color.background,
    padding: Constants.spacing.small,
    textAlignVertical: 'top',
    height: 100,
    color: Color.textPrimary,
    fontSize: 13,
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
  proceedBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
