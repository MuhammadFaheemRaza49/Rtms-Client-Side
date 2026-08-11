import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Color from '../../common/Color';
import Constants from '../../common/Constants';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DatePickerModal = ({ visible, selectedDate, onSelect, onClose }) => {
  // Parse initial selected date or default to today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date calculation helpers
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Generate calendar grid array
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getFirstDayOfMonth(currentYear, currentMonth);

  const gridData = [];
  // Fill offset days
  for (let i = 0; i < startDayOffset; i++) {
    gridData.push({ id: `empty-${i}`, day: null, dateObj: null });
  }
  // Fill actual days
  for (let dayVal = 1; dayVal <= totalDays; dayVal++) {
    const dateObj = new Date(currentYear, currentMonth, dayVal);
    gridData.push({ id: `day-${dayVal}`, day: dayVal, dateObj });
  }

  const handleDayPress = (dateObj) => {
    if (!dateObj || dateObj < today) return; // Disable past dates
    
    // Format as YYYY-MM-DD
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    
    onSelect(formatted);
    onClose();
  };

  const renderDayItem = ({ item }) => {
    const { day, dateObj } = item;

    if (!day) {
      return <View style={styles.dayCellEmpty} />;
    }

    const isPast = dateObj < today;
    
    // Check if selected
    const isSelected =
      selectedDate &&
      new Date(selectedDate).getFullYear() === dateObj.getFullYear() &&
      new Date(selectedDate).getMonth() === dateObj.getMonth() &&
      new Date(selectedDate).getDate() === dateObj.getDate();

    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          isSelected && styles.dayCellSelected,
          isPast && styles.dayCellDisabled,
        ]}
        disabled={isPast}
        onPress={() => handleDayPress(dateObj)}
      >
        <Text
          style={[
            styles.dayText,
            isSelected && styles.dayTextSelected,
            isPast && styles.dayTextDisabled,
          ]}
        >
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header row */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={handlePrevMonth}>
              <Text style={styles.navButtonText}>◀</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            
            <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
              <Text style={styles.navButtonText}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <FlatList
            data={gridData}
            renderItem={renderDayItem}
            keyExtractor={(item) => item.id}
            numColumns={7}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
          />

          {/* Cancel button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Constants.spacing.large,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Color.surface,
    borderRadius: Constants.borderRadius.large,
    padding: Constants.spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Constants.spacing.large,
  },
  headerTitle: {
    fontSize: Constants.fontSize.title,
    fontWeight: 'bold',
    color: Color.textPrimary,
  },
  navButton: {
    paddingHorizontal: Constants.spacing.medium,
    paddingVertical: Constants.spacing.small,
  },
  navButtonText: {
    fontSize: Constants.fontSize.subheading,
    color: Color.headerBlue,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Constants.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
    paddingBottom: Constants.spacing.small,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: Constants.fontSize.bodySmall,
    fontWeight: 'bold',
    color: Color.textSecondary,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: Constants.spacing.tiny,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellEmpty: {
    width: 36,
    height: 36,
  },
  dayCellSelected: {
    backgroundColor: Color.headerBlue,
  },
  dayCellDisabled: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: Constants.fontSize.body,
    color: Color.textPrimary,
  },
  dayTextSelected: {
    color: Color.white,
    fontWeight: 'bold',
  },
  dayTextDisabled: {
    color: Color.textMuted,
    textDecorationLine: 'line-through',
  },
  closeButton: {
    marginTop: Constants.spacing.large,
    paddingVertical: Constants.spacing.medium,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  closeButtonText: {
    color: Color.textSecondary,
    fontSize: Constants.fontSize.body,
    fontWeight: 'bold',
  },
});

export default DatePickerModal;
