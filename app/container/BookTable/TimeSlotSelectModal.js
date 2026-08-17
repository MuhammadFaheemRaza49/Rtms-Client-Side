import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

const MEAL_PERIODS = [
  {
    title: 'Breakfast',
    slots: ['08:00 - 10:00 AM', '10:00 - 12:00 PM'],
  },
  {
    title: 'Lunch',
    slots: ['12:00 - 02:00 PM', '02:00 - 04:00 PM', '04:00 - 06:00 PM'],
  },
  {
    title: 'Dinner',
    slots: ['06:00 - 08:00 PM', '08:00 - 10:00 PM', '10:00 - 12:00 AM'],
  },
];

export default function TimeSlotSelectModal({
  visible,
  onClose,
  initialSlot,
  onConfirm,
}) {
  const [selectedSlot, setSelectedSlot] = useState(() => initialSlot);

  const handleSelectSlot = (label, period) => {
    if (selectedSlot?.label === label) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ label, period });
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedSlot);
    }
    onClose();
  };

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

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Select Time</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
                {MEAL_PERIODS.map((period) => (
                  <View key={period.title} style={styles.periodSection}>
                    <Text style={styles.periodTitle}>{period.title}</Text>
                    <View style={styles.chipsContainer}>
                      {period.slots.map((slot) => {
                        const isSelected = selectedSlot?.label === slot;
                        return (
                          <TouchableOpacity
                            key={slot}
                            style={[
                              styles.slotChip,
                              isSelected && styles.selectedChip,
                            ]}
                            onPress={() => handleSelectSlot(slot, period.title)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                isSelected && styles.selectedChipText,
                              ]}
                            >
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Confirm Button */}
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
    maxHeight: '80%',
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollArea: {
    marginBottom: 20,
  },
  periodSection: {
    marginBottom: 24,
  },
  periodTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    borderColor: '#1552B3',
    backgroundColor: '#1552B3',
  },
  chipText: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
