// components/ForecastRow.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ForecastItem } from '../types';
import { fontSizes } from '../theme/typography';
import { formatDate } from '../utils/typhoonSignals';

const EMOJIS: Record<string, string> = {
  clear: '☀️', clouds: '☁️', rain: '🌧️', drizzle: '🌦️',
  thunderstorm: '⛈️', snow: '❄️', mist: '🌫️', typhoon: '🌀', storm: '🌪️',
};

interface ForecastRowProps {
  forecast: ForecastItem[];
}

export default function ForecastRow({ forecast }: ForecastRowProps) {
  if (!forecast.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {forecast.map((item) => (
          <View key={item.timestamp} style={styles.card}>
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            <Text style={styles.emoji}>{EMOJIS[item.condition] || '🌤️'}</Text>
            <Text style={styles.temp}>{item.temperature}°</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 8 },
  title: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSizes.sm,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  scroll: { gap: 10, paddingBottom: 4 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    alignItems: 'center',
    width: 90,
    gap: 4,
  },
  date: { color: 'rgba(255,255,255,0.55)', fontSize: fontSizes.xs, fontWeight: '600' },
  emoji: { fontSize: 28 },
  temp: { color: '#ffffff', fontSize: fontSizes.lg, fontWeight: '700' },
  desc: { color: 'rgba(255,255,255,0.45)', fontSize: 10, textAlign: 'center', lineHeight: 13 },
});
