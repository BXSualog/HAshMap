// services/notificationService.ts
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { TyphoonSignal } from '../types';
import { TYPHOON_SIGNAL_INFO } from '../utils/constants';

// Check if running in Expo Go
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Lazy-load notifications ONLY if NOT in Expo Go
const getNotifications = () => {
  if (isExpoGo) return null;
  try {
    return require('expo-notifications');
  } catch (err) {
    return null;
  }
};

export function initializeNotifications() {
  if (isExpoGo) {
    console.warn('Notifications skipped: Not supported in Expo Go (SDK 53+). Use a development build for testing.');
    return;
  }

  try {
    const Notifications = getNotifications();
    if (!Notifications) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    Notifications.setNotificationCategoryAsync('typhoon-alert', [
      {
        identifier: 'view-alert',
        buttonTitle: 'View Details',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: { opensAppToForeground: false },
      },
    ]);
  } catch (error) {
    console.error('Notification setup failed:', error);
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('typhoon-alerts', {
      name: 'Typhoon Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ef4444',
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('weather-updates', {
      name: 'Weather Updates',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendTyphoonAlertNotification(
  signal: TyphoonSignal,
  location: string
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications || signal === 0) return;

  const info = TYPHOON_SIGNAL_INFO[signal as keyof typeof TYPHOON_SIGNAL_INFO];
  if (!info) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${info.icon} Typhoon Alert: ${info.label}`,
        body: `${info.label} has been raised in ${location}. ${info.tips[0] || 'Stay safe.'}`,
        data: { signal, location, type: 'typhoon_alert' },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        categoryIdentifier: 'typhoon-alert',
        color: info.color,
      },
      trigger: null,
    });
  } catch (err) {
    console.warn('Failed to send notification:', err);
  }
}

export async function sendWeatherUpdateNotification(
  city: string,
  temp: number,
  description: string
): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🌤️ Weather Update — ${city}`,
        body: `${temp}°C, ${description}`,
        data: { type: 'weather_update' },
        sound: 'default',
      },
      trigger: null,
    });
  } catch (err) {
    console.warn('Failed to send weather notification:', err);
  }
}

export function addNotificationResponseListener(
  handler: (response: any) => void
) {
  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  try {
    return Notifications.addNotificationResponseReceivedListener(handler);
  } catch (err) {
    return { remove: () => { } };
  }
}

export function addNotificationReceivedListener(
  handler: (notification: any) => void
) {
  const Notifications = getNotifications();
  if (!Notifications) return { remove: () => { } };

  try {
    return Notifications.addNotificationReceivedListener(handler);
  } catch (err) {
    return { remove: () => { } };
  }
}

export async function getBadgeCount(): Promise<number> {
  const Notifications = getNotifications();
  if (!Notifications) return 0;
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (err) {
    return 0;
  }
}

export async function clearBadge(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (err) {
    // Ignore
  }
}
