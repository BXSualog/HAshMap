// services/geminiService.ts
import Constants from 'expo-constants';
import { WeatherData, TyphoonAlert } from '../types';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string {
  return (Constants.expoConfig?.extra?.geminiApiKey as string) || '';
}

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

const SYSTEM_PROMPT = `You are AlistoAI, a helpful weather assistant specialized in Philippine typhoons and weather safety. 
You provide accurate, concise, and safety-focused information.
Always respond in a calm, reassuring tone while being direct about dangers.
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
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const weatherContext = buildWeatherContext(weather, alert);

  const systemInstruction = `${SYSTEM_PROMPT}\n\nREAL-TIME WEATHER DATA:\n${weatherContext}`;

  const historyToSend = history.slice(-10); // Keep last 10 messages for context

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      ...historyToSend,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorData}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No response from Gemini');

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
