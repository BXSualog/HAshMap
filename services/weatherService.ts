// services/weatherService.ts — Open-Meteo (no API key required)
import { WeatherData, ForecastItem, WeatherCondition } from '../types';

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

// ─── WMO weather code → WeatherCondition ─────────────────────────────────────
function mapWMOCode(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'clouds';
  if (code >= 45 && code <= 48) return 'mist';
  if (code >= 51 && code <= 67) return 'drizzle';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'clear';
}

function wmoDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

// ─── Current weather ──────────────────────────────────────────────────────────
export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
    `weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();

  const c = data.current;
  const wCode: number = c.weather_code ?? 0;
  // wind_speed_10m from Open-Meteo is in km/h — convert to m/s for existing signal logic
  const windSpeedMs = (c.wind_speed_10m ?? 0) / 3.6;

  return {
    city: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`, // placeholder until reverse-geo
    country: '',
    temperature: Math.round(c.temperature_2m ?? 0),
    feelsLike: Math.round(c.apparent_temperature ?? c.temperature_2m ?? 0),
    humidity: c.relative_humidity_2m ?? 0,
    windSpeed: windSpeedMs,
    windDirection: c.wind_direction_10m ?? 0,
    description: wmoDescription(wCode),
    condition: mapWMOCode(wCode),
    icon: String(wCode),
    pressure: c.surface_pressure ?? 0,
    visibility: (c.visibility ?? 0),
    rainVolume: undefined,
    timestamp: Math.floor(new Date(data.current_weather_units?.time ?? Date.now()).getTime() / 1000) || Math.floor(Date.now() / 1000),
    lat,
    lon,
  };
}

// ─── 5-day forecast ───────────────────────────────────────────────────────────
export async function fetchForecast(lat: number, lon: number): Promise<ForecastItem[]> {
  const url =
    `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum` +
    `&timezone=auto&forecast_days=5`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo forecast error: ${res.status}`);
  const data = await res.json();

  const daily = data.daily;
  const days: ForecastItem[] = (daily.time as string[]).map((dateStr, i) => ({
    timestamp: Math.floor(new Date(dateStr).getTime() / 1000),
    temperature: Math.round(((daily.temperature_2m_max[i] ?? 0) + (daily.temperature_2m_min[i] ?? 0)) / 2),
    condition: mapWMOCode(daily.weather_code[i] ?? 0),
    description: wmoDescription(daily.weather_code[i] ?? 0),
    windSpeed: (daily.wind_speed_10m_max[i] ?? 0) / 3.6, // convert km/h → m/s
    rainVolume: daily.precipitation_sum[i] ?? undefined,
  }));

  return days;
}

// ─── Search by city name (geocoding → weather) ────────────────────────────────
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const geoRes = await fetch(
    `${GEO_BASE}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  if (!geoRes.ok) throw new Error(`Geocoding error: ${geoRes.status}`);
  const geoData = await geoRes.json();

  if (!geoData.results?.length) throw new Error(`City "${city}" not found`);

  const { latitude: lat, longitude: lon, name, country_code } = geoData.results[0];
  const weather = await fetchCurrentWeather(lat, lon);

  return { ...weather, city: name, country: country_code ?? '' };
}
