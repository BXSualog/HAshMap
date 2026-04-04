import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Linking } from 'react-native';
import { TyphoonAlert, TyphoonSignal } from '../types';
import { TYPHOON_SIGNAL_INFO } from '../utils/constants';
import { signalColors } from '../theme/colors';
import { fontSizes } from '../theme/typography';

interface TyphoonBannerProps {
  alert: TyphoonAlert;
  onPress?: () => void;
}

export default function TyphoonBanner({ alert, onPress }: TyphoonBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const info = TYPHOON_SIGNAL_INFO[alert.signal as keyof typeof TYPHOON_SIGNAL_INFO];
  const color = signalColors[alert.signal] || signalColors[0];

  useEffect(() => {
    if (alert.signal >= 3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [alert.signal]);

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Animated.View style={[styles.banner, { borderLeftColor: color, opacity: alert.signal >= 3 ? pulseAnim : 1 }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View style={styles.textArea}>
          <Text style={[styles.signalLabel, { color }]}>{info?.icon} {info?.label}</Text>
          <Text style={styles.description} numberOfLines={2}>{info?.description}</Text>
          <Text style={styles.location}>📍 {alert.location}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 12 },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  textArea: { flex: 1, gap: 3 },
  signalLabel: {
    fontWeight: '700',
    fontSize: fontSizes.md,
    letterSpacing: 0.3,
  },
  description: {
    color: '#cbd5e1',
    fontSize: fontSizes.sm,
    lineHeight: 18,
  },
  location: {
    color: '#94a3b8',
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
});
