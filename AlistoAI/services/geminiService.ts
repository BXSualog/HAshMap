// services/geminiService.ts
import { WeatherData, TyphoonAlert } from '../types';

import { GoogleGenAI } from '@google/genai';
import Constants from 'expo-constants';

// Polyfill AbortSignal.timeout for React Native environment
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

const GEMINI_API_KEY = "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";

console.log('[Gemini] Key loaded:', GEMINI_API_KEY ? `${GEMINI_API_KEY.slice(0, 8)}...` : 'EMPTY ❌');
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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

const SYSTEM_PROMPT = `You are Alisto:Go AI, a weather assistant specialized in Philippine typhoons and weather safety. 
You provide accurate, concise, and safety-focused information.
Always respond in a calm, reassuring tone while being direct about dangers.
If asked about specific locations or tracking, you can provide coordinates in (lat, lon) format, and I will automatically translate them for the user.
Keep responses under 150 words unless more detail is genuinely needed.
If a typhoon signal is active, always remind users to follow official government advisories.`;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export async function sendGeminiMessage(
  userMessage: string,
  weather: WeatherData | null,
  alert: TyphoonAlert | null,
  history: ChatMessage[] = []
): Promise<string> {
  const weatherContext = buildWeatherContext(weather, alert);
  const systemInst = `${SYSTEM_PROMPT}\n\nREAL-TIME WEATHER DATA:\n${weatherContext}`;

  // Transform Gemini history format to OpenRouter format
  const openRouterHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.parts[0].text
  }));

  const messages = [
    { role: 'system', content: systemInst },
    ...openRouterHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
      'HTTP-Referer': 'https://alistogo.com', // Optional, for OpenRouter rankings
      'X-Title': 'Alisto:Go', // Optional, for OpenRouter rankings
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: messages,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 0.95
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter Error:', errorData);
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content;
  if (!text) throw new Error('No response from OpenRouter');

  return text.trim();
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
