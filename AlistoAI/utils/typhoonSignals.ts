// utils/typhoonSignals.ts — Signal detection from weather data
import { TyphoonSignal, WeatherData, WeatherCondition } from '../types';

/**
 * Determine typhoon signal level from wind speed (m/s) and weather description.
 */
export function detectTyphoonSignal(
  windSpeedMs: number,
  description: string,
  conditionCode: number
): TyphoonSignal {
  const windKph = windSpeedMs * 3.6;
  const desc = description.toLowerCase();

  // Condition code 900 = tornado, 902 = typhoon (some providers)
  const isTyphoon =
    conditionCode === 900 ||
    conditionCode === 902 ||
    desc.includes('typhoon') ||
    desc.includes('tropical storm') ||
    desc.includes('tropical cyclone') ||
    desc.includes('bagyo');

  if (!isTyphoon && windKph < 30) return 0;

  if (windKph >= 221) return 5;
  if (windKph >= 171) return 4;
  if (windKph >= 121) return 3;
  if (windKph >= 61) return 2;
  if (windKph >= 30 || isTyphoon) return 1;

  return 0;
}

/**
 * Map OpenWeatherMap condition codes to our WeatherCondition type.
 */
export function mapConditionCode(code: number): WeatherCondition {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'mist';
  if (code === 800) return 'clear';
  if (code > 800) return 'clouds';
  if (code === 900 || code === 902) return 'typhoon';
  return 'storm';
}

/**
 * Format wind speed (m/s) to kph string.
 */
export function formatWindSpeed(ms: number): string {
  return `${Math.round(ms * 3.6)} km/h`;
}

/**
 * Format timestamp to readable date/time string.
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate a unique ID.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
