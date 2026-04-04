// tasks/backgroundWeather.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_WEATHER_TASK, HEAT_INDEX_THRESHOLD } from '../utils/constants';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';
import {
  getCachedLocation,
  cacheWeatherData,
  getCachedWeather,
  getLastNotifTime,
  setLastNotifTime,
} from '../services/storageService';
import { detectTyphoonSignal, formatDate } from '../utils/typhoonSignals';
import {
  sendTyphoonAlertNotification,
  sendHeatAlertNotification,
  sendUpcomingTyphoonNotification,
  sendWeatherUpdateNotification,
} from '../services/notificationService';

// Define the background task
TaskManager.defineTask(BACKGROUND_WEATHER_TASK, async () => {
  try {
    const location = await getCachedLocation();
    if (!location) return BackgroundFetch.BackgroundFetchResult.NoData;

    const weather = await fetchCurrentWeather(location.lat, location.lon);
    
    // Use cached location names instead of placeholders
    weather.city = location.city;
    weather.country = location.country;
    
    await cacheWeatherData(weather);

    const now = Date.now();
    const sixHoursMs = 6 * 60 * 60 * 1000;
    const locationStr = `${weather.city}, ${weather.country}`;

    // 1. Check for Active Signal Changes
    const signal = detectTyphoonSignal(weather.windSpeed, weather.description, 0);
    const cached = await getCachedWeather();
    const prevSignal = cached
      ? detectTyphoonSignal(cached.windSpeed, cached.description, 0)
      : 0;

    if (signal > 0 && signal !== prevSignal) {
      await sendTyphoonAlertNotification(signal as any, locationStr);
    }

    // 2. Check for upcoming threats in forecast
    const forecast = await fetchForecast(location.lat, location.lon);
    if (forecast.length > 0) {
      let maxUpcomingSignal = 0;
      let expectedDateStr = '';

      for (const item of forecast) {
        const forecastSignal = detectTyphoonSignal(item.windSpeed, item.description, 0);
        if (forecastSignal > maxUpcomingSignal && forecastSignal > signal) {
          maxUpcomingSignal = forecastSignal;
          expectedDateStr = formatDate(item.timestamp);
        }
      }

      if (maxUpcomingSignal > 0) {
        const lastUpcomingAlert = await getLastNotifTime('upcoming_typhoon');
        if (now - lastUpcomingAlert >= sixHoursMs) {
          await sendUpcomingTyphoonNotification(maxUpcomingSignal, locationStr, expectedDateStr);
          await setLastNotifTime('upcoming_typhoon', now);
        }
      }
    }

    // 3. Check for High Heat Index (>= HEAT_INDEX_THRESHOLD°C)
    const heatIndex = Math.max(weather.temperature, weather.feelsLike);
    if (heatIndex >= HEAT_INDEX_THRESHOLD) {
      const lastHeatAlert = await getLastNotifTime('heat_alert');
      if (now - lastHeatAlert >= sixHoursMs) {
        await sendHeatAlertNotification(heatIndex, locationStr);
        await setLastNotifTime('heat_alert', now);
      }
    }

    // 4. Regular Weather Status Update (Every 30 mins)
    const lastWeatherUpdate = await getLastNotifTime('weather_status');
    const thirtyMinsMs = 30 * 60 * 1000;
    if (now - lastWeatherUpdate >= thirtyMinsMs) {
      await sendWeatherUpdateNotification(weather.city, weather.temperature, weather.description);
      await setLastNotifTime('weather_status', now);
    }



    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[BG Task] Weather fetch error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundWeatherTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_WEATHER_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_WEATHER_TASK, {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('[BG Task] Background weather task registered');
    }
  } catch (error) {
    console.warn('[BG Task] Could not register background task:', error);
  }
}

export async function unregisterBackgroundWeatherTask(): Promise<void> {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_WEATHER_TASK);
  } catch (error) {
    console.warn('[BG Task] Could not unregister background task:', error);
  }
}
