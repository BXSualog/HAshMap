// tasks/backgroundWeather.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_WEATHER_TASK } from '../utils/constants';
import { fetchCurrentWeather } from '../services/weatherService';
import { getCachedLocation, cacheWeatherData } from '../services/storageService';
import { detectTyphoonSignal } from '../utils/typhoonSignals';
import { sendTyphoonAlertNotification } from '../services/notificationService';
import { getCachedWeather } from '../services/storageService';

// Define the background task
TaskManager.defineTask(BACKGROUND_WEATHER_TASK, async () => {
  try {
    const location = await getCachedLocation();
    if (!location) return BackgroundFetch.BackgroundFetchResult.NoData;

    const weather = await fetchCurrentWeather(location.lat, location.lon);
    await cacheWeatherData(weather);

    // Check for signal changes
    const signal = detectTyphoonSignal(weather.windSpeed, weather.description, 0);
    const cached = await getCachedWeather();
    const prevSignal = cached
      ? detectTyphoonSignal(cached.windSpeed, cached.description, 0)
      : 0;

    if (signal > 0 && signal !== prevSignal) {
      await sendTyphoonAlertNotification(
        signal as any,
        `${weather.city}, ${weather.country}`
      );
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
