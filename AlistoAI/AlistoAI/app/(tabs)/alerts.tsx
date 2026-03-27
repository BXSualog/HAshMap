// app/(tabs)/alerts.tsx — Alert History Screen
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import AlertHistoryItem from '../../components/AlertHistoryItem';
import { fontSizes } from '../../theme/typography';
import { clearAlertHistory } from '../../services/storageService';

export default function AlertsScreen() {
  const { alertHistory, currentSignal, activeAlert, setAlertHistory } = useAppStore();

  const handleClearHistory = async () => {
    await clearAlertHistory();
    setAlertHistory([]);
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Alert History</Text>
            <Text style={styles.subtitle}>{alertHistory.length} recorded alerts</Text>
          </View>
          {alertHistory.length > 0 && (
            <Pressable onPress={handleClearHistory} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {/* Active Signal Banner */}
        {currentSignal > 0 && activeAlert && (
          <View style={styles.currentSignalBanner}>
            <Text style={styles.currentSignalText}>
              🔴 CURRENTLY ACTIVE: Signal #{currentSignal} — {activeAlert.location}
            </Text>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {alertHistory.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyTitle}>No Alerts Recorded</Text>
              <Text style={styles.emptyDesc}>
                When typhoon signals are detected, they'll appear here for your reference.
              </Text>
            </View>
          ) : (
            alertHistory.map((alert) => (
              <AlertHistoryItem key={alert.id} alert={alert} />
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0a0e27' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  title: {
    color: '#ffffff',
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  clearBtnText: {
    color: '#ef4444',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  currentSignalBanner: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  currentSignalText: {
    color: '#ef4444',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  scrollContent: { padding: 16 },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    color: '#ffffff',
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  emptyDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});
