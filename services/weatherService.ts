// services/weatherService.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { WeatherData, ForecastItem } from '../types';
import { mapConditionCode, detectTyphoonSignal } from '../utils/typhoonSignals';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getApiKey(): string {
  return (Constants.expoConfig?.extra?.openWeatherApiKey as string) || '';
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key not configured');

  const res = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: apiKey, units: 'metric' },
    timeout: 10000,
  });

  const d = res.data;
  const conditionCode = d.weather[0].id;

  return {
    city: d.name,
    country: d.sys.country,
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    windSpeed: d.wind.speed,
    windDirection: d.wind.deg ?? 0,
    description: d.weather[0].description,
    condition: mapConditionCode(conditionCode),
    icon: d.weather[0].icon,
    pressure: d.main.pressure,
    visibility: d.visibility,
    rainVolume: d.rain?.['1h'],
    timestamp: d.dt,
    lat: d.coord.lat,
    lon: d.coord.lon,
  };
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastItem[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key not configured');

  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: apiKey, units: 'metric', cnt: 40 },
    timeout: 10000,
  });

  // Get one entry per day (noon-ish)
  const items: ForecastItem[] = res.data.list
    .filter((_: any, i: number) => i % 8 === 4)
    .slice(0, 5)
    .map((item: any) => ({
      timestamp: item.dt,
      temperature: Math.round(item.main.temp),
      condition: mapConditionCode(item.weather[0].id),
      description: item.weather[0].description,
      windSpeed: item.wind.speed,
      rainVolume: item.rain?.['3h'],
    }));

  return items;
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key not configured');

  const res = await axios.get(`${BASE_URL}/weather`, {
    params: { q: `${city},PH`, appid: apiKey, units: 'metric' },
    timeout: 10000,
  });

  const d = res.data;
  const conditionCode = d.weather[0].id;

  return {
    city: d.name,
    country: d.sys.country,
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    windSpeed: d.wind.speed,
    windDirection: d.wind.deg ?? 0,
    description: d.weather[0].description,
    condition: mapConditionCode(conditionCode),
    icon: d.weather[0].icon,
    pressure: d.main.pressure,
    visibility: d.visibility,
    rainVolume: d.rain?.['1h'],
    timestamp: d.dt,
    lat: d.coord.lat,
    lon: d.coord.lon,
  };
}
