import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Lucide from 'lucide-react-native';

import Color from '../../common/Color';
import Constants from '../../common/Constants';
import BackIconComponent from '../ComponentsV2/ComponentsV2/BackIconComponent';

export default function ChargesSummaryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10, paddingBottom: 16 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <BackIconComponent color={Color.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Deposit Payment</Text>
        </View>
      </View>

      {/* Main Beautiful Coming Soon Block */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Lucide.CreditCard color="#0B4FA4" size={48} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          Online deposit payment integration is currently under development. Soon you'll be able to pay and secure your reservations instantly using your debit or credit card.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0B4FA4',
    paddingHorizontal: 32,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B4FA4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
