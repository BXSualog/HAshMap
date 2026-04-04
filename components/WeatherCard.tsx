// components/WeatherCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WeatherData } from '../types';
import { fontSizes, getResponsiveFontSize } from '../theme/typography';
import { useResponsive } from '../hooks/useResponsive';
import { palette } from '../theme/colors';
import { formatWindSpeed } from '../utils/typhoonSignals';

interface WeatherCardProps {
  weather: WeatherData;
  isOffline?: boolean;
}

const WEATHER_EMOJIS: Record<string, string> = {
  clear: '☀️',
  clouds: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  thunderstorm: '⛈️',
  snow: '❄️',
  mist: '🌫️',
  typhoon: '🌀',
  storm: '🌪️',
};

export default function WeatherCard({ weather, isOffline }: WeatherCardProps) {
  const { isLargeScreen, spacing } = useResponsive();
  const emoji = WEATHER_EMOJIS[weather.condition] || '🌤️';

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>📴 Offline — cached data</Text>
        </View>
      )}

      {/* Location */}
      <Text style={styles.location}>
        📍 {weather.city}, {weather.country}
      </Text>

      {/* Main Temperature Display */}
      <View style={[styles.tempRow, isLargeScreen && { gap: 24 }]}>
        <Text style={[styles.emoji, { fontSize: isLargeScreen ? 84 : 64 }]}>{emoji}</Text>
        <Text style={[styles.temperature, { fontSize: isLargeScreen ? 120 : 96 }]}>{weather.temperature}°C</Text>
      </View>

      <Text style={styles.description}>{weather.description}</Text>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, isLargeScreen && { gap: 16 }]}>
        <StatBadge icon="💧" label="Humidity" value={`${weather.humidity}%`} isLarge={isLargeScreen} />
        <StatBadge icon="💨" label="Wind" value={formatWindSpeed(weather.windSpeed)} isLarge={isLargeScreen} />
        <StatBadge icon="🌡️" label="Feels Like" value={`${weather.feelsLike}°C`} isLarge={isLargeScreen} />
        <StatBadge icon="📊" label="Pressure" value={`${weather.pressure} hPa`} isLarge={isLargeScreen} />
      </View>
    </View>
  );
}

function StatBadge({
  icon,
  label,
  value,
  isLarge,
}: {
  icon: string;
  label: string;
  value: string;
  isLarge: boolean;
}) {
  return (
    <View style={[styles.statBadge, isLarge && { minWidth: '22%' }]}>
      <Text style={[styles.statIcon, { fontSize: isLarge ? 24 : 20 }]}>{icon}</Text>
      <Text style={[styles.statValue, { fontSize: getResponsiveFontSize('base', isLarge) }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize('xs', isLarge) }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  offlineBadge: {
    backgroundColor: 'rgba(234,179,8,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.4)',
  },
  offlineText: {
    color: '#fbbf24',
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  location: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSizes.base,
    marginBottom: 16,
    fontWeight: '500',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  temperature: {
    fontSize: 96,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSizes.lg,
    textTransform: 'capitalize',
    marginBottom: 24,
    fontWeight: '300',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: '44%',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: fontSizes.base,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
});
