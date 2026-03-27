// components/DynamicBackground.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherCondition, TyphoonSignal } from '../types';
import { conditionGradients } from '../theme/colors';

interface DynamicBackgroundProps {
  condition: WeatherCondition;
  signal: TyphoonSignal;
  children: React.ReactNode;
  style?: ViewStyle;
}

function getColors(condition: WeatherCondition, signal: TyphoonSignal): string[] {
  if (signal >= 4) return ['#0a0000', '#1a0000', '#2a0008', '#0d0014'];
  if (signal >= 3) return ['#0d0a1a', '#1a0a0a', '#2a0000', '#1a000a'];
  if (signal >= 2) return ['#0a0d1a', '#0d1a2a', '#1a1020', '#0a0810'];
  if (signal >= 1) return ['#0a1020', '#0d1530', '#1a2040', '#0d1525'];
  return conditionGradients[condition] || conditionGradients.clear;
}

export default function DynamicBackground({
  condition,
  signal,
  children,
  style,
}: DynamicBackgroundProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const isStorm = signal >= 3 || condition === 'thunderstorm' || condition === 'typhoon';

  useEffect(() => {
    if (isStorm) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isStorm]);

  const colors = getColors(condition, signal);

  // Animate opacity between two gradient sets when stormy
  const stormInterp = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.0],
  });

  return (
    <Animated.View style={[styles.container, style, { opacity: stormInterp }]}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
