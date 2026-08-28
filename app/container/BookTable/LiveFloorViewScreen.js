import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import NavigationPath from '../../navigation/NavigationPath';

import * as Lucide from 'lucide-react-native';
import BackIconComponent from '../ComponentsV2/ComponentsV2/BackIconComponent';

import { FloorPlanCanvas } from '../../components/canvas/FloorPlanCanvas';
import {
  selectTable,
  deselectTable,
  selectFloor,
  getTables,
  getFloorTables,
} from '../../redux/tables';

export default function LiveFloorViewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [showDateTimeAlert, setShowDateTimeAlert] = React.useState(false);

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedDate, selectedTimeSlot } = useSelector((state) => state.booking);
  const { selectedFloorId, selectedTableIds, floors, tablesByFloor, loading, error, branchId: tablesBranchId } = useSelector((state) => state.tables);

  useEffect(() => {
    const hasFloorsLoaded = Array.isArray(floors) && floors.length > 0;
    const isSameBranch = tablesBranchId === activeBranchId;
    if (!hasFloorsLoaded || !isSameBranch) {
      dispatch(getTables(activeBranchId, selectedDate, selectedTimeSlot));
    }
  }, [dispatch, activeBranchId, floors, selectedDate, selectedTimeSlot, tablesBranchId]);

  const handleTablePress = (tableId) => {
    if (!selectedDate || !selectedTimeSlot) {
      setShowDateTimeAlert(true);
      return;
    }
    if (selectedTableIds.includes(tableId)) {
      dispatch(deselectTable(tableId));
    } else {
      dispatch(selectTable(tableId));
    }
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setShowDateTimeAlert(true);
      return;
    }
    if (selectedTableIds.length === 0) return;
    navigation.navigate(NavigationPath.AdditionalNeeds, { restaurantId: activeBranchId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const activeFloor = floors && floors.find((f) => f.id === selectedFloorId || f.floorId === selectedFloorId);
  const activeFloorIdKey = activeFloor?.floorId || activeFloor?.id || selectedFloorId;
  const floorTables = (activeFloorIdKey && tablesByFloor && tablesByFloor[activeFloorIdKey]) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10, paddingBottom: 16 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <BackIconComponent color={Color.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Table</Text>
        </View>
      </View>

      {/* Floor Tabs Selection */}
      {floors && floors.length > 0 && (
        <View style={styles.floorTabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.floorTabsContainer}>
            {floors.map((f) => {
              const isActive = selectedFloorId === f.id || selectedFloorId === f.floorId;
              const label = f.nameI18n?.en || f.name || 'Floor';
              return (
                <TouchableOpacity
                  key={f.id || f.floorId}
                  style={[styles.floorTab, isActive && styles.floorTabActive]}
                  onPress={() => {
                    const targetFloorId = f.floorId || f.id;
                    dispatch(selectFloor(targetFloorId));
                    dispatch(getFloorTables(targetFloorId, selectedDate, selectedTimeSlot));
                  }}
                >
                  <Text style={[styles.floorTabText, isActive && styles.floorTabTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Floor view title info */}
      <View style={styles.infoArea}>
        <Text style={styles.floorName}>
          {activeFloor ? (activeFloor.nameI18n?.en || activeFloor.name) : 'Floor Layout'}
        </Text>
        <Text style={styles.infoSubtext}>Tap on any available table to reserve</Text>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Color.headerBlue} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FloorPlanCanvas
            tables={floorTables}
            selectedTableIds={selectedTableIds}
            onTablePress={handleTablePress}
            canvasMeta={activeFloor?.canvasMeta}
            scrollable={true}
          />
        )}
      </View>

      {/* Legend Row */}
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
          <View style={[styles.legendDot, { backgroundColor: Color.selected }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Bottom Proceed Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionLabel}>Selected Tables</Text>
          <Text style={styles.selectionCount}>
            {selectedTableIds.length} {selectedTableIds.length === 1 ? 'Table' : 'Tables'}
          </Text>
        </View>
        <TouchableOpacity
          disabled={selectedTableIds.length === 0}
          style={[styles.proceedBtn, selectedTableIds.length === 0 && styles.disabledBtn]}
          onPress={handleProceed}
        >
          <Text style={styles.proceedBtnText}>Next: Passenger Details</Text>
        </TouchableOpacity>
      </View>

      {/* Date & Time Required Alert Modal */}
      <Modal
        visible={showDateTimeAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateTimeAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconWrapper}>
              <Lucide.CalendarClock size={36} color={Color.reserved} />
            </View>
            <Text style={styles.alertTitle}>Date & Time Required</Text>
            <Text style={styles.alertMessage}>
              Please select your booking date and time slot first to view available tables and reserve.
            </Text>
            <TouchableOpacity
              style={styles.alertBtn}
              onPress={() => setShowDateTimeAlert(false)}
            >
              <Text style={styles.alertBtnText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  infoArea: {
    padding: Constants.spacing.large,
    alignItems: 'center',
  },
  floorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.surface,
    marginHorizontal: 0,
    padding: 0,
    borderWidth: 0,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: Constants.spacing.medium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Color.textSecondary,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  bottomBar: {
    backgroundColor: Color.surface,
    borderTopWidth: 1,
    borderTopColor: Color.border,
    paddingHorizontal: Constants.spacing.large,
    paddingTop: 12,
    elevation: 10,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectionLabel: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  proceedBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: Color.border,
  },
  proceedBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  floorTabsWrapper: {
    backgroundColor: Color.surface,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
    paddingVertical: 10,
  },
  floorTabsContainer: {
    paddingHorizontal: Constants.spacing.large,
    gap: 8,
  },
  floorTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
  },
  floorTabActive: {
    borderColor: Color.headerBlue,
    borderWidth: 1.5,
  },
  floorTabText: {
    fontSize: 14,
    color: Color.textSecondary,
  },
  floorTabTextActive: {
    color: Color.headerBlue,
    fontWeight: 'bold',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: Color.surface,
    borderRadius: 16,
    padding: 24,
    width: '82%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  alertIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: Color.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  alertBtn: {
    backgroundColor: Color.headerBlue,
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  alertBtnText: {
    color: Color.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
