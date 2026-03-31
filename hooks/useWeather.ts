// hooks/useWeather.ts
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';
import { cacheWeatherData, getCachedWeather, saveAlertHistory, getLastNotifTime, setLastNotifTime } from '../services/storageService';
import {
  sendTyphoonAlertNotification,
  sendHeatAlertNotification,
  sendUpcomingTyphoonNotification,
} from '../services/notificationService';
import { generateId, formatDate, detectTyphoonSignal } from '../utils/typhoonSignals';
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

        // Override the placeholder coordinate string with the actual geo-coded city name
        const storeLocation = useAppStore.getState().location;
        if (storeLocation) {
          weatherData.city = storeLocation.city;
          weatherData.country = storeLocation.country;
        }

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

        // Monitor High Heat Index
        const previousHeatIndex = weather ? Math.max(weather.temperature, weather.feelsLike) : 0;
        const currentHeatIndex = Math.max(weatherData.temperature, weatherData.feelsLike);
        
        if (previousHeatIndex < 25 && currentHeatIndex >= 25) {
          const location = `${weatherData.city}, ${weatherData.country}`;
          await sendHeatAlertNotification(currentHeatIndex, location);
        }

        // Monitor Forecast for Upcoming Typhoons (Signal >= 1)
        if (forecastData.length > 0) {
          let maxUpcomingSignal = 0;
          let expectedDateStr = '';

          for (const item of forecastData) {
            const forecastSignal = detectTyphoonSignal(item.windSpeed, item.description, 0);
            if (forecastSignal > maxUpcomingSignal && forecastSignal > signal) {
              maxUpcomingSignal = forecastSignal;
              expectedDateStr = formatDate(item.timestamp);
            }
          }

          if (maxUpcomingSignal > 0) {
            const lastUpcomingAlert = await getLastNotifTime('upcoming_typhoon');
            const now = Date.now();
            const sixHoursMs = 6 * 60 * 60 * 1000;

            if (now - lastUpcomingAlert >= sixHoursMs) {
              const location = `${weatherData.city}, ${weatherData.country}`;
              await sendUpcomingTyphoonNotification(maxUpcomingSignal, location, expectedDateStr);
              await setLastNotifTime('upcoming_typhoon', now);
            }
          }
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
