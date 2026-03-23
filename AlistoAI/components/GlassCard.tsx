// components/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { palette } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 20,
  tint = 'dark',
  borderRadius = 20,
}: GlassCardProps) {
  return (
    <BlurView intensity={intensity} tint={tint} style={[styles.blur, { borderRadius }, style]}>
      <View style={[styles.overlay, { borderRadius }]}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    width: '100%',
  },
});
