import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, TyphoonAlert, LocationData, UserSettings } from '../types';

const KEYS = {
  WEATHER: 'alistoai_weather',
  ALERTS: 'alistoai_alerts',
  LOCATION: 'alistoai_location',
  SETTINGS: 'alistoai_settings',
  NOTIF_TRACKER: 'alistoai_notif_tracker',
};

export const defaultSettings: UserSettings = {
  notificationsEnabled: true,
  locationAutoDetect: true,
  darkMode: true,
  alertThreshold: 1,
  emergencyContacts: [],
  language: 'en',
};

export async function cacheWeatherData(data: WeatherData): Promise<void> {
  await AsyncStorage.setItem(KEYS.WEATHER, JSON.stringify(data));
}

export async function getCachedWeather(): Promise<WeatherData | null> {
  const raw = await AsyncStorage.getItem(KEYS.WEATHER);
  return raw ? JSON.parse(raw) : null;
}

export async function saveAlertHistory(alert: TyphoonAlert): Promise<void> {
  const history = await getAlertHistory();
  history.unshift(alert);
  const trimmed = history.slice(0, 50);
  await AsyncStorage.setItem(KEYS.ALERTS, JSON.stringify(trimmed));
}

export async function getAlertHistory(): Promise<TyphoonAlert[]> {
  const raw = await AsyncStorage.getItem(KEYS.ALERTS);
  return raw ? JSON.parse(raw) : [];
}

export async function clearAlertHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.ALERTS);
}

export async function cacheLocation(data: LocationData): Promise<void> {
  await AsyncStorage.setItem(KEYS.LOCATION, JSON.stringify(data));
}

export async function getCachedLocation(): Promise<LocationData | null> {
  const raw = await AsyncStorage.getItem(KEYS.LOCATION);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
}

export async function getLastNotifTime(type: string): Promise<number> {
  const raw = await AsyncStorage.getItem(`${KEYS.NOTIF_TRACKER}_${type}`);
  return raw ? parseInt(raw, 10) : 0;
}

export async function setLastNotifTime(type: string, time: number): Promise<void> {
  await AsyncStorage.setItem(`${KEYS.NOTIF_TRACKER}_${type}`, time.toString());
}

