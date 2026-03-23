// hooks/useWeather.ts
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';
import { cacheWeatherData, getCachedWeather } from '../services/storageService';
import { detectTyphoonSignal } from '../utils/typhoonSignals';
import { sendTyphoonAlertNotification } from '../services/notificationService';
import { saveAlertHistory } from '../services/storageService';
import { generateId } from '../utils/typhoonSignals';
import { TyphoonAlert, TyphoonSignal } from '../types';

export function useWeather() {
  const {
    weather,
    forecast,
    isWeatherLoading,
    weatherError,
    lastUpdated,
    currentSignal,
    settings,
    setWeather,
    setForecast,
    setWeatherLoading,
    setWeatherError,
    setCurrentSignal,
    setActiveAlert,
    addAlertToHistory,
    setOffline,
  } = useAppStore();

  const refreshWeather = useCallback(
    async (lat: number, lon: number) => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(lat, lon),
          fetchForecast(lat, lon),
        ]);

        // Cache for offline use
        await cacheWeatherData(weatherData);

        setWeather(weatherData);
        setForecast(forecastData);
        setOffline(false);

        // Detect typhoon signal
        const signal = detectTyphoonSignal(
          weatherData.windSpeed,
          weatherData.description,
          0
        ) as TyphoonSignal;

        const previousSignal = currentSignal;
        setCurrentSignal(signal);

        if (signal > 0) {
          const alert: TyphoonAlert = {
            id: generateId(),
            signal,
            description: `Wind speed ${Math.round(weatherData.windSpeed * 3.6)} km/h detected.`,
            location: `${weatherData.city}, ${weatherData.country}`,
            timestamp: weatherData.timestamp,
            windSpeed: weatherData.windSpeed,
            isActive: true,
          };
          setActiveAlert(alert);

          // Only notify if signal changed upward and notifications are enabled
          if (signal !== previousSignal && signal >= settings.alertThreshold) {
            await sendTyphoonAlertNotification(signal, alert.location);
            await saveAlertHistory(alert);
            addAlertToHistory(alert);
          }
        } else {
          setActiveAlert(null);
        }
      } catch (error: any) {
        console.error('Weather fetch error:', error);
        setWeatherError(error.message || 'Failed to fetch weather');
        // Load cached data if available
        const cached = await getCachedWeather();
        if (cached) {
          setWeather(cached);
          setOffline(true);
        }
      } finally {
        setWeatherLoading(false);
      }
    },
    [currentSignal, settings.alertThreshold]
  );

  return { weather, forecast, isWeatherLoading, weatherError, lastUpdated, refreshWeather };
}
