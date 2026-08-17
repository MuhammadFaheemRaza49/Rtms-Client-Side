import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePickerModal({
  visible,
  onClose,
  initialDate,
  onConfirm,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initialize the selected date and current viewed month/year
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate) {
      const d = new Date(initialDate);
      return isNaN(d.getTime()) ? new Date() : d;
    }
    return new Date();
  });

  const [currentYear, setCurrentYear] = useState(() => selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDateSelect = (day) => {
    const newSelected = new Date(currentYear, currentMonth, day);
    newSelected.setHours(0, 0, 0, 0);
    if (newSelected >= today) {
      setSelectedDate(newSelected);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedDate);
    }
    onClose();
  };

  // Generate calendar grid dates
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const gridCells = [];
  // Empty slots before the first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push({ key: `empty-${i}`, day: null });
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentYear, currentMonth, day);
    cellDate.setHours(0, 0, 0, 0);
    const isDisabled = cellDate < today;
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;

    gridCells.push({
      key: `day-${day}`,
      day,
      isDisabled,
      isSelected,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Handle Bar on top of Bottom Sheet */}
              <View style={styles.handleBar} />

              {/* Header Navigation */}
              <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                  <Text style={styles.navArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthHeaderTitle}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                  <Text style={styles.navArrow}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Weekdays Labels */}
              <View style={styles.weekdaysRow}>
                {WEEKDAYS.map((day) => (
                  <Text key={day} style={styles.weekdayLabel}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Days Grid */}
              <View style={styles.gridContainer}>
                {gridCells.map((cell, index) => {
                  if (cell.day === null) {
                    return <View key={cell.key} style={styles.gridCell} />;
                  }

                  return (
                    <TouchableOpacity
                      key={cell.key}
                      style={[
                        styles.gridCell,
                        cell.isSelected && styles.selectedCell,
                      ]}
                      disabled={cell.isDisabled}
                      onPress={() => handleDateSelect(cell.day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          cell.isDisabled && styles.disabledDayText,
                          cell.isSelected && styles.selectedDayText,
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Confirm Action Button */}
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  handleBar: {
    width: 48,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 28,
    color: '#1F2937',
    fontWeight: '300',
  },
  monthHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  gridCell: {
    width: '14.28%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  selectedCell: {
    backgroundColor: '#1552B3',
    borderRadius: 21,
  },
  dayText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  disabledDayText: {
    color: '#D1D5DB',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#1552B3',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
