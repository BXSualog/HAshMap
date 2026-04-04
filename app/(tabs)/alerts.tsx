// app/(tabs)/alerts.tsx — Alert History Screen
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import AlertHistoryItem from '../../components/AlertHistoryItem';
import { fontSizes } from '../../theme/typography';
import { clearAlertHistory } from '../../services/storageService';
import {
  sendHeatAlertNotification,
  sendTyphoonAlertNotification,
  sendUpcomingTyphoonNotification
} from '../../services/notificationService';
import { HEAT_INDEX_THRESHOLD } from '../../utils/constants';

export default function AlertsScreen() {
  const { alertHistory, currentSignal, activeAlert, setAlertHistory, weather } = useAppStore();

  const handleClearHistory = async () => {
    await clearAlertHistory();
    setAlertHistory([]);
  };

  const isHeatAlertVisible = weather && (weather.temperature >= HEAT_INDEX_THRESHOLD || weather.feelsLike >= HEAT_INDEX_THRESHOLD);
  const isAnyAlertVisible = alertHistory.length > 0 || isHeatAlertVisible || currentSignal > 0;

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Alert History</Text>
            <Text style={styles.subtitle}>{alertHistory.length} recorded alerts</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={() => {
                const locationStr = weather?.city ? `${weather.city}, ${weather.country}` : 'Test City, PH';

                Alert.alert(
                  'Test Notifications',
                  'Select an alert type to verify device push behavior:',
                  [
                    { text: `Heat Alert (${HEAT_INDEX_THRESHOLD}°C+)`, onPress: () => sendHeatAlertNotification(HEAT_INDEX_THRESHOLD + 1, locationStr) },
                    { text: 'Signal #1 (Active)', onPress: () => sendTyphoonAlertNotification(1, locationStr) },
                    { text: 'Signal #3 (Active)', onPress: () => sendTyphoonAlertNotification(3, locationStr) },
                    { text: 'Signal #2 (Upcoming)', onPress: () => sendUpcomingTyphoonNotification(2, locationStr, 'Tomorrow') },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}
              style={[styles.clearBtn, { borderColor: 'rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}
            >
              <Text style={[styles.clearBtnText, { color: '#fbbf24' }]}>Test Notify</Text>
            </Pressable>
            {alertHistory.length > 0 && (
              <Pressable onPress={handleClearHistory} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Active Signal Banner */}
        {currentSignal > 0 && activeAlert && (
          <View style={styles.currentSignalBanner}>
            <Text style={styles.currentSignalText}>
              CURRENTLY ACTIVE: Signal #{currentSignal} — {activeAlert.location}
            </Text>
          </View>
        )}

        {/* Heat Index Banner */}
        {isHeatAlertVisible && (
          <View style={styles.heatIndexBanner}>
            <Text style={styles.heatIndexTitle}>
              {`\u26A0\uFE0F High Heat Index Alert`}
            </Text>
            <Text style={styles.heatIndexText}>
              {`Stay Hydrated! Current index: ${Math.round(weather.feelsLike || weather.temperature)}\u00B0C`}
            </Text>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isAnyAlertVisible ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No Alerts Recorded</Text>
              <Text style={styles.emptyDesc}>
                When typhoon signals or climate warnings are detected, they'll appear here.
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
  heatIndexBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  heatIndexTitle: {
    color: '#fbbf24',
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginBottom: 4,
  },
  heatIndexText: {
    color: '#fde68a',
    fontSize: fontSizes.base,
    fontWeight: '500',
  },
  scrollContent: { padding: 16 },
  empty: {
    alignItems: 'center',
    paddingTop: 150,
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
