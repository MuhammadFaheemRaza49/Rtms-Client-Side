import React, { useEffect } from 'react';
import {
  ActivityIndicator,
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

import { FloorPlanCanvas } from '../../components/canvas/FloorPlanCanvas';
import {
  selectTable,
  deselectTable,
  selectFloor,
  getTables,
} from '../../redux/tables';

export default function LiveFloorViewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { restaurantId } = route.params || {};
  const activeBranchId = restaurantId || '00000000-0000-7000-8000-000000000030';

  const { selectedDate, selectedTimeSlot } = useSelector((state) => state.booking);
  const { selectedFloorId, selectedTableIds, floors, tablesByFloor, loading, error } = useSelector((state) => state.tables);

  useEffect(() => {
    const hasFloorsLoaded = Array.isArray(floors) && floors.length > 0;
    if (!hasFloorsLoaded) {
      dispatch(getTables(activeBranchId, selectedDate, selectedTimeSlot));
    }
  }, [dispatch, activeBranchId, floors]);

  const handleTablePress = (tableId) => {
    if (selectedTableIds.includes(tableId)) {
      dispatch(deselectTable(tableId));
    } else {
      dispatch(selectTable(tableId));
    }
  };

  const handleProceed = () => {
    if (selectedTableIds.length === 0) return;
    navigation.navigate(NavigationPath.AdditionalNeeds, { restaurantId: activeBranchId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const activeFloor = floors && floors.find((f) => f.id === selectedFloorId);
  const floorTables = (selectedFloorId && tablesByFloor[selectedFloorId]) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Table</Text>
        </View>
      </View>

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
          <Text style={styles.proceedBtnText}>Next: Additional Needs</Text>
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
    marginHorizontal: Constants.spacing.large,
    borderRadius: Constants.borderRadius.large,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Constants.spacing.medium,
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
});
