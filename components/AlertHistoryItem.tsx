// components/AlertHistoryItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TyphoonAlert } from '../types';
import { signalColors, palette } from '../theme/colors';
import { fontSizes } from '../theme/typography';
import { TYPHOON_SIGNAL_INFO } from '../utils/constants';
import { formatDateTime } from '../utils/typhoonSignals';

interface AlertHistoryItemProps {
  alert: TyphoonAlert;
}

export default function AlertHistoryItem({ alert }: AlertHistoryItemProps) {
  const info = TYPHOON_SIGNAL_INFO[alert.signal as keyof typeof TYPHOON_SIGNAL_INFO];
  const color = signalColors[alert.signal];

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
          <Text style={[styles.badgeText, { color }]}>{info?.icon} {info?.label}</Text>
        </View>
        {alert.isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>
        )}
      </View>
      <Text style={styles.location}>📍 {alert.location}</Text>
      <Text style={styles.description}>{info?.description}</Text>
      <Text style={styles.time}>🕐 {formatDateTime(alert.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 6,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
  activeBadge: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  activeText: {
    color: '#ef4444',
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  location: {
    color: '#cbd5e1',
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  description: {
    color: '#94a3b8',
    fontSize: fontSizes.xs,
    lineHeight: 16,
  },
  time: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: fontSizes.xs,
  },
});
