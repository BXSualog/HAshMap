import { WeatherData, TyphoonAlert, ForecastItem } from '../types';
import axios from 'axios';

const globalAny = global as any;
if (!globalAny.AbortSignal) {
  globalAny.AbortSignal = function () { };
}
if (!globalAny.AbortSignal.timeout) {
  globalAny.AbortSignal.timeout = function () {
    const controller = new AbortController();
    return controller.signal;
  };
}

import Constants from 'expo-constants';

const getAPIKey = () => {
  const extraKey = Constants.expoConfig?.extra?.geminiApiKey;
  const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const fallbackKey = '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';

  const isValid = (k: any) => k && typeof k === 'string' && k.startsWith('sk-or-v1-') && k.length > 32;

  if (isValid(extraKey)) return extraKey as string;
  if (isValid(envKey)) return envKey as string;
  return fallbackKey;
};

const OPENROUTER_API_KEY = getAPIKey();

console.log('[Gemini] Key loaded:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.slice(0, 12)}...` : 'EMPTY ❌');

function buildWeatherContext(weather: WeatherData | null, alert: TyphoonAlert | null): string {
  if (!weather) return 'No current weather data available.';

  let context = `Current weather in ${weather.city}, ${weather.country}:
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.description}
- Wind Speed: ${Math.round(weather.windSpeed * 3.6)} km/h
- Humidity: ${weather.humidity}%
- Pressure: ${weather.pressure} hPa
- Visibility: ${(weather.visibility / 1000).toFixed(1)} km`;

  if (alert && alert.signal > 0) {
    context += `\n\nACTIVE TYPHOON ALERT: Signal #${alert.signal} has been raised.
- ${alert.description}
- Affected area: ${alert.location}`;
  } else {
    context += '\n\nNo active typhoon signal at this time.';
  }

  return context;
}

function buildForecastAndMediaContext(forecast: ForecastItem[] | null, news: string | null): string {
  let context = '';

  if (forecast && forecast.length > 0) {
    context += '\n\nNEXT 5 DAYS FORECAST:';
    forecast.forEach(day => {
      const date = new Date(day.timestamp * 1000).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
      context += `\n- ${date}: ${day.temperature}°C, ${day.description}${day.rainVolume ? `, Rain: ${day.rainVolume}mm` : ''}`;
    });
  }

  if (news && news.trim()) {
    context += `\n\nLATEST MEDIA UPDATES / WEATHER ADVISORIES:\n${news}`;
  }

  return context;
}

const SYSTEM_PROMPT = `You are Alisto:Go AI, a weather commander specialized in Philippine weather safety.
You have access to real-time scientific data (WEATHER_DATA), future trends (FORECAST), and news reports (MEDIA).
Your goal is to "Predict" potential hazards and provide "Alisto" (ready/alert) guidance.

GUIDELINES:
1. PREDICTION: Use the trend in the 5-day forecast to warn users about upcoming changes (e.g., "It's sunny now, but forecast shows heavy rain starting Wednesday").
2. MEDIA: Incorporate latest bulletins when provided to add ground-level context.
3. ALISTO ADVICE: Be proactive. If rain is expected, suggest checking drainage; if heat is expected, suggest hydration.
4. TONE: Be calm, direct, and authoritative in safety-critical situations.
5. LENGTH: Keep responses under 200 words. Stick to facts.`;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export async function sendGeminiMessage(
  userMessage: string,
  weather: WeatherData | null,
  alert: TyphoonAlert | null,
  history: ChatMessage[] = [],
  forecast: ForecastItem[] | null = null,
  news: string | null = null
): Promise<string> {
  const weatherContext = buildWeatherContext(weather, alert);
  const extraContext = buildForecastAndMediaContext(forecast, news);
  const systemInst = `${SYSTEM_PROMPT}\n\nSITUATIONAL REPORT:\n${weatherContext}${extraContext}`;

  const openRouterHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.parts[0].text
  }));

  const messages = [
    { role: 'system', content: systemInst },
    ...openRouterHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    console.log('[Gemini] Sending request | Key:', OPENROUTER_API_KEY ? `"Bearer ${OPENROUTER_API_KEY.slice(0, 12)}..."` : '"Bearer [EMPTY]"');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: messages,
        temperature: 0.7,
        max_tokens: 512,
        top_p: 0.95,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://alistogo.com',
          'X-Title': 'Alisto:Go',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    const text = data.choices[0]?.message?.content;
    if (!text) throw new Error('No response from OpenRouter');

    return text.trim();
  } catch (error: any) {
    const errMsg = error?.response?.data?.error?.message || error.message || `API Error: ${error}`;
    console.error('OpenRouter Error:', error?.response?.data || error.message);
    throw new Error(errMsg);
  }
}

export async function getQuickWeatherSummary(
  weather: WeatherData,
  alert: TyphoonAlert | null
): Promise<string> {
  const prompt =
    alert && alert.signal >= 1
      ? `Typhoon Signal #${alert.signal} is active. Give a very brief 2-sentence safety advisory.`
      : `Give a warm, 2-sentence summary of today's weather and a brief tip.`;

  return sendGeminiMessage(prompt, weather, alert, []);
}
