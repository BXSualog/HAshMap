// app/(tabs)/settings.tsx — Settings Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { saveSettings } from '../../services/storageService';
import { fontSizes } from '../../theme/typography';
import { signalColors } from '../../theme/colors';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import { TyphoonSignal } from '../../types';

export default function SettingsScreen() {
  const { settings, updateSettings, weather, location, currentSignal, isOffline } = useAppStore();

  const toggle = async (key: keyof typeof settings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    updateSettings({ [key]: value });
    await saveSettings(updated);
  };

  const setAlertThreshold = async (threshold: TyphoonSignal) => {
    const updated = { ...settings, alertThreshold: threshold };
    updateSettings({ alertThreshold: threshold });
    await saveSettings(updated);
  };

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>App Status</Text>
            <StatusRow label="Location" value={location ? `${location.city}, ${location.province}` : 'Not detected'} ok={!!location} />
            <StatusRow label="Weather" value={weather ? `${weather.temperature}°C, ${weather.description}` : 'No data'} ok={!!weather} />
            <StatusRow label="Connection" value={isOffline ? 'Offline (cached)' : 'Online'} ok={!isOffline} />
            <StatusRow
              label="Signal Level"
              value={currentSignal === 0 ? 'None' : `Signal #${currentSignal}`}
              ok={currentSignal === 0}
              color={currentSignal > 0 ? signalColors[currentSignal] : undefined}
            />
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <SettingsRow
              label="Typhoon Alerts"
              sub="Receive push notifications for typhoon signals"
              right={<Switch value={settings.notificationsEnabled} onValueChange={(v) => toggle('notificationsEnabled', v)} trackColor={{ true: '#1a73e8' }} />}
            />
            <View style={styles.thresholdArea}>
              <Text style={styles.thresholdLabel}>Alert Threshold</Text>
              <Text style={styles.thresholdSub}>Notify me starting from Signal #</Text>
              <View style={styles.thresholdRow}>
                {([1, 2, 3, 4] as TyphoonSignal[]).map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setAlertThreshold(s)}
                    style={[
                      styles.thresholdBtn,
                      settings.alertThreshold === s && {
                        backgroundColor: signalColors[s] + '33',
                        borderColor: signalColors[s],
                      },
                    ]}
                  >
                    <Text style={[styles.thresholdBtnText, settings.alertThreshold === s && { color: signalColors[s] }]}>
                      #{s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <SettingsRow
              label="Auto-Detect Location"
              sub="Use GPS to automatically determine your location"
              right={<Switch value={settings.locationAutoDetect} onValueChange={(v) => toggle('locationAutoDetect', v)} trackColor={{ true: '#1a73e8' }} />}
            />
          </View>

          {/* Emergency Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Numbers</Text>
            {EMERGENCY_NUMBERS.map((contact) => (
              <Pressable key={contact.number} onPress={() => callNumber(contact.number)} style={styles.contactRow}>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <Text style={styles.callIcon}>📞</Text>
              </Pressable>
            ))}
          </View>

          {/* API Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration</Text>
            <View style={styles.apiRow}>
              <Text style={styles.apiLabel}>Gemini API</Text>
              <View style={styles.apiStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.apiStatusText}>Connected</Text>
              </View>
            </View>
            <Text style={styles.apiHint}>Update API keys in the .env file and rebuild the app.</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatusRow({ label, value, ok, color }: { label: string; value: string; ok: boolean; color?: string }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, { color: color || (ok ? '#4ade80' : '#f87171') }]}>{value}</Text>
    </View>
  );
}

function SettingsRow({ label, sub, right }: { label: string; sub: string; right: React.ReactNode }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsRowLeft}>
        <Text style={styles.settingsLabel}>{label}</Text>
        <Text style={styles.settingsSub}>{sub}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0a0e27' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  title: { color: '#ffffff', fontSize: fontSizes.xl, fontWeight: '800' },
  content: { padding: 16, gap: 16 },
  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: 14,
    paddingBottom: 8,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statusLabel: { color: 'rgba(255,255,255,0.6)', fontSize: fontSizes.sm },
  statusValue: { fontSize: fontSizes.sm, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  settingsRowLeft: { flex: 1, marginRight: 12 },
  settingsLabel: { color: '#ffffff', fontSize: fontSizes.base, fontWeight: '500' },
  settingsSub: { color: 'rgba(255,255,255,0.4)', fontSize: fontSizes.xs, marginTop: 3 },
  thresholdArea: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  thresholdLabel: { color: '#ffffff', fontSize: fontSizes.base, fontWeight: '500' },
  thresholdSub: { color: 'rgba(255,255,255,0.4)', fontSize: fontSizes.xs, marginTop: 3, marginBottom: 10 },
  thresholdRow: { flexDirection: 'row', gap: 8 },
  thresholdBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  thresholdBtnText: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: fontSizes.base },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  contactName: { color: '#ffffff', fontSize: fontSizes.sm, fontWeight: '500' },
  contactNumber: { color: '#60a5fa', fontSize: fontSizes.xs, marginTop: 2 },
  callIcon: { fontSize: 22 },
  apiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  apiLabel: { color: '#ffffff', fontSize: fontSizes.base },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80' },
  apiStatusText: { color: '#4ade80', fontSize: fontSizes.sm, fontWeight: '600' },
  apiHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: fontSizes.xs,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
});
