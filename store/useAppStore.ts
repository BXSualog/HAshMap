// store/useAppStore.ts
import { create } from 'zustand';
import {
  WeatherData,
  LocationData,
  TyphoonAlert,
  ChatMessage,
  UserSettings,
  TyphoonSignal,
  ForecastItem,
} from '../types';
import { defaultSettings } from '../services/storageService';

interface AppState {
  // Auth
  user: any | null;

  // Weather
  weather: WeatherData | null;
  forecast: ForecastItem[];
  isWeatherLoading: boolean;
  weatherError: string | null;
  lastUpdated: number | null;

  // Location
  location: LocationData | null;
  isLocationLoading: boolean;

  // Typhoon
  currentSignal: TyphoonSignal;
  activeAlert: TyphoonAlert | null;
  alertHistory: TyphoonAlert[];

  // Chat
  chatHistory: ChatMessage[];
  isChatLoading: boolean;

  // Settings
  settings: UserSettings;

  // App state
  isOffline: boolean;
  isInitialized: boolean;
  isOnboardingComplete: boolean;
  isTermsAgreed: boolean;

  // Actions — Weather
  setWeather: (weather: WeatherData) => void;
  setForecast: (forecast: ForecastItem[]) => void;
  setWeatherLoading: (loading: boolean) => void;
  setWeatherError: (error: string | null) => void;

  // Actions — Location
  setLocation: (location: LocationData) => void;
  setLocationLoading: (loading: boolean) => void;

  // Actions — Typhoon
  setCurrentSignal: (signal: TyphoonSignal) => void;
  setActiveAlert: (alert: TyphoonAlert | null) => void;
  addAlertToHistory: (alert: TyphoonAlert) => void;
  setAlertHistory: (alerts: TyphoonAlert[]) => void;

  // Actions — Chat
  addChatMessage: (message: ChatMessage) => void;
  updateLastChatMessage: (updates: Partial<ChatMessage>) => void;
  clearChat: () => void;
  setChatLoading: (loading: boolean) => void;

  // Actions — Settings
  updateSettings: (settings: Partial<UserSettings>) => void;


  // Actions — App
  setOffline: (offline: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: any | null) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setTermsAgreed: (agreed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  weather: null,
  forecast: [],
  isWeatherLoading: false,
  weatherError: null,
  lastUpdated: null,

  location: null,
  isLocationLoading: false,

  currentSignal: 0,
  activeAlert: null,
  alertHistory: [],

  chatHistory: [],
  isChatLoading: false,

  settings: defaultSettings,

  isOffline: false,
  isInitialized: false,
  isOnboardingComplete: false,
  isTermsAgreed: false,

  // Weather actions
  setWeather: (weather) =>
    set({ weather, weatherError: null, lastUpdated: Date.now() }),
  setForecast: (forecast) => set({ forecast }),
  setWeatherLoading: (isWeatherLoading) => set({ isWeatherLoading }),
  setWeatherError: (weatherError) => set({ weatherError }),

  // Location actions
  setLocation: (location) => set({ location }),
  setLocationLoading: (isLocationLoading) => set({ isLocationLoading }),

  // Typhoon actions
  setCurrentSignal: (currentSignal) => set({ currentSignal }),
  setActiveAlert: (activeAlert) => set({ activeAlert }),
  addAlertToHistory: (alert) =>
    set((state) => ({ alertHistory: [alert, ...state.alertHistory].slice(0, 50) })),
  setAlertHistory: (alertHistory) => set({ alertHistory }),

  // Chat actions
  addChatMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  updateLastChatMessage: (updates) =>
    set((state) => {
      const history = [...state.chatHistory];
      if (history.length === 0) return state;
      history[history.length - 1] = { ...history[history.length - 1], ...updates };
      return { chatHistory: history };
    }),
  clearChat: () => set({ chatHistory: [] }),
  setChatLoading: (isChatLoading) => set({ isChatLoading }),

  // Settings actions
  updateSettings: (updates) =>
    set((state) => ({ settings: { ...state.settings, ...updates } })),

  // App actions
  setOffline: (isOffline) => set({ isOffline }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setUser: (user) => set({ user }),
  setOnboardingComplete: (isOnboardingComplete) => set({ isOnboardingComplete }),
  setTermsAgreed: (isTermsAgreed) => set({ isTermsAgreed }),
}));
