// app/(tabs)/index.tsx — Dashboard / Home Screen
import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { useWeather } from '../../hooks/useWeather';
import { getCurrentLocation, getLastKnownLocationOrDefault } from '../../services/locationService';
import { getAlertHistory, getSettings } from '../../services/storageService';
import { requestNotificationPermissions } from '../../services/notificationService';
import { registerBackgroundWeatherTask } from '../../tasks/backgroundWeather';
import DynamicBackground from '../../components/DynamicBackground';
import WeatherCard from '../../components/WeatherCard';
import TyphoonBanner from '../../components/TyphoonBanner';
import ForecastRow from '../../components/ForecastRow';
import GlassCard from '../../components/GlassCard';
import { fontSizes, fonts } from '../../theme/typography';
import { TYPHOON_SIGNAL_INFO } from '../../utils/constants';
import { formatDateTime } from '../../utils/typhoonSignals';

export default function DashboardScreen() {
  const {
    weather,
    forecast,
    isWeatherLoading,
    isOffline,
    location,
    currentSignal,
    activeAlert,
    settings,
    setLocation,
    setLocationLoading,
    setAlertHistory,
    setInitialized,
    isInitialized,
    updateSettings,
  } = useAppStore();

  const { refreshWeather } = useWeather();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize app on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, []);

  useEffect(() => {
    if (weather) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [weather]);

  const initializeApp = async () => {
    try {
      // Load saved settings
      const savedSettings = await getSettings();
      updateSettings(savedSettings);

      // Request permissions
      await requestNotificationPermissions();
      await registerBackgroundWeatherTask();

      // Get location
      setLocationLoading(true);
      const loc = await getCurrentLocation();
      const finalLoc = loc || (await getLastKnownLocationOrDefault());
      setLocation(finalLoc);
      setLocationLoading(false);

      // Fetch weather
      await refreshWeather(finalLoc.lat, finalLoc.lon);

      // Load alert history
      const history = await getAlertHistory();
      setAlertHistory(history);

      setInitialized(true);
    } catch (error) {
      console.error('Init error:', error);
      setLocationLoading(false);
      setInitialized(true);
    }
  };

  const onRefresh = useCallback(async () => {
    if (location) {
      await refreshWeather(location.lat, location.lon);
    }
  }, [location, refreshWeather]);

  const condition = weather?.condition || 'clear';
  const isHeatAlertVisible = weather && (weather.temperature >= 25 || weather.feelsLike >= 25);

  return (
    <DynamicBackground condition={condition} signal={currentSignal} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>
              Alisto:<Text style={styles.appNameHighlight}>Go</Text>
            </Text>
            <Text style={styles.headerSub}>
              {location ? `${location.city}, ${location.province}` : 'Detecting location...'}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isWeatherLoading}
              onRefresh={onRefresh}
              tintColor="rgba(255,255,255,0.5)"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Typhoon Banner */}
          {activeAlert && activeAlert.signal > 0 && (
            <TyphoonBanner
              alert={activeAlert}
              onPress={() => router.push('/(tabs)/alerts')}
            />
          )}

          {/* Heat Index Badge */}
          {isHeatAlertVisible && (
            <View style={[styles.safeBadge, styles.heatBadge]}>
              <Text style={[styles.safeBadgeText, { color: '#fde68a' }]}>
                {`\u26A0\uFE0F High heat index: Stay Hydrated (${Math.round(weather!.feelsLike || weather!.temperature)}\u00B0C)`}
              </Text>
            </View>
          )}

          {/* No active signal badge */}
          {(!activeAlert || activeAlert.signal === 0) && !isHeatAlertVisible && (
            <View style={styles.safeBadge}>
              <Text style={styles.safeBadgeText}>No Warning in Climate Seen</Text>
            </View>
          )}

          {/* Weather Card */}
          {weather ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              <WeatherCard weather={weather} isOffline={isOffline} />
            </Animated.View>
          ) : (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>
                {isWeatherLoading ? 'Fetching weather...' : ' Please wait'}
              </Text>
            </View>
          )}

          {/* Forecast */}
          {forecast.length > 0 && <ForecastRow forecast={forecast} />}

          {/* Evacuation Tips */}
          {activeAlert && activeAlert.signal >= 3 && (
            <GlassCard style={styles.tipsCard} borderRadius={16} intensity={15}>
              <Text style={styles.tipsTitle}>Evacuation Tips</Text>
              {TYPHOON_SIGNAL_INFO[activeAlert.signal as keyof typeof TYPHOON_SIGNAL_INFO]?.tips.map(
                (tip, i) => (
                  <Text key={i} style={styles.tip}>• {tip}</Text>
                )
              )}
            </GlassCard>
          )}

          {/* Last updated */}
          {weather && (
            <Text style={styles.lastUpdated}>
              Last updated: {formatDateTime(weather.timestamp)}
            </Text>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  appName: {
    color: '#ffffff',
    fontSize: fontSizes['2xl'],
    fontWeight: '900',
    letterSpacing: -0.5,
    fontFamily: fonts.serif,
  },
  appNameHighlight: {
    color: '#f97316', // Vibrant orange
  },
  headerSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSizes.sm,
    marginTop: 1,
  },
  aiBtn: {
    backgroundColor: 'rgba(26,115,232,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(26,115,232,0.5)',
  },
  aiBtnText: {
    color: '#60a5fa',
    fontSize: fontSizes.sm,
    fontWeight: '600',
    fontFamily: fonts.serif,
  },
  scrollContent: { paddingBottom: 16 },
  safeBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  safeBadgeText: {
    color: '#ffffffff',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  heatBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSizes.base,
  },
  tipsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 6,
  },
  tipsTitle: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: fontSizes.base,
    marginBottom: 8,
  },
  tip: {
    color: '#cbd5e1',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  lastUpdated: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: fontSizes.xs,
    textAlign: 'center',
    marginTop: 20,
  },
});
