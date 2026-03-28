// types/index.ts — Core data types for AlistoAI

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // m/s
  windDirection: number;
  description: string;
  condition: WeatherCondition;
  icon: string;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  rainVolume?: number; // mm last 1h
  timestamp: number;
  lat: number;
  lon: number;
}

export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'typhoon'
  | 'storm';

export interface ForecastItem {
  timestamp: number;
  temperature: number;
  condition: WeatherCondition;
  description: string;
  windSpeed: number;
  rainVolume?: number;
}

export type TyphoonSignal = 0 | 1 | 2 | 3 | 4 | 5;

export interface TyphoonAlert {
  id: string;
  signal: TyphoonSignal;
  name?: string;
  description: string;
  location: string;
  timestamp: number;
  windSpeed: number;
  isActive: boolean;
  evacuationTips?: string[];
}

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  province: string;
  country: string;
  isManual: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  locationAutoDetect: boolean;
  darkMode: boolean;
  alertThreshold: TyphoonSignal;
  emergencyContacts: EmergencyContact[];
  language: 'en' | 'fil';
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
}
