// services/geminiService.ts
import { WeatherData, TyphoonAlert } from '../types';
import axios from 'axios';

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

// Key is set directly to avoid Metro's "undefined" string inlining issue with process.env
const getAPIKey = () => {
  const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const fallbackKey = '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';
  // Check if key is a valid string and not literally "undefined"
  const isValid = (k: any) => k && typeof k === 'string' && k.startsWith('sk-or-v1-') && k.length > 32;
  return isValid(envKey) ? envKey as string : fallbackKey;
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
