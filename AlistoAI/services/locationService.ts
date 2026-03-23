// services/locationService.ts
import * as Location from 'expo-location';
import { LocationData } from '../types';
import { getCachedLocation, cacheLocation } from './storageService';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function requestBackgroundLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
    });

    const geocode = await reverseGeocode(location.coords.latitude, location.coords.longitude);
    const locationData: LocationData = {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      city: geocode.city,
      province: geocode.province,
      country: geocode.country,
      isManual: false,
    };

    await cacheLocation(locationData);
    return locationData;
  } catch (error) {
    console.error('Location error:', error);
    // Fall back to cached location
    return getCachedLocation();
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<{ city: string; province: string; country: string }> {
  try {
    const result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (result.length > 0) {
      const place = result[0];
      return {
        city: place.city || place.district || place.subregion || 'Unknown City',
        province: place.region || place.subregion || '',
        country: place.country || 'PH',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed:', e);
  }
  return { city: 'Unknown', province: '', country: 'PH' };
}

/** Get last known location with fallback to Manila default */
export async function getLastKnownLocationOrDefault(): Promise<LocationData> {
  const cached = await getCachedLocation();
  if (cached) return cached;

  // Default: Metro Manila
  return {
    lat: 14.5995,
    lon: 120.9842,
    city: 'Manila',
    province: 'Metro Manila',
    country: 'PH',
    isManual: false,
  };
}
