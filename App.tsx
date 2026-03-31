import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || Constants.expoConfig?.extra?.geminiApiKey || "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";

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    let promptAddition = '';
    const weatherMatch = userMessage.match(/weather (?:in|for|at) ([\w\s]+)/i);

    if (weatherMatch) {
      const city = weatherMatch[1].trim();
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          const loc = geoData.results[0];
          const lat = loc.latitude;
          const lng = loc.longitude;
          const cityName = loc.name;

          // Step 2: Weather Forecast
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
          );
          const weatherData = await weatherRes.json();

          if (weatherData.current) {
            const temp = Math.round(weatherData.current.temperature_2m);
            const wCode = weatherData.current.weather_code;


            let condition = 'Clear';
            if (wCode >= 1 && wCode <= 3) condition = 'Cloudy';
            if (wCode >= 45 && wCode <= 48) condition = 'Foggy';
            if (wCode >= 51 && wCode <= 67) condition = 'Rainy';
            if (wCode >= 71 && wCode <= 77) condition = 'Snowy';
            if (wCode >= 95 && wCode <= 99) condition = 'Thunderstorms';

            promptAddition = `\n[System Note: Open-Meteo API reports that the current weather in ${cityName} is ${temp}°C, ${condition}, Humidity: ${weatherData.current.relative_humidity_2m}%, Wind: ${weatherData.current.wind_speed_10m}km/h. Please incorporate this data smoothly into your response.]`;

            // Maintain the same widget data structure as before to avoid UI breaks
            setCurrentWeather({
              name: cityName,
              main: { temp: temp },
              weather: [{ description: condition }]
            });
          } else {
            setCurrentWeather(null);
            setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Open-Meteo returned successful response but no current weather data for ${cityName}.` }]);
            setLoading(false); return;
          }
        } else {
          setCurrentWeather(null);
          setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Could not locate the city "${city}" via Open-Meteo Geocoding.` }]);
          setLoading(false); return;
        }
      } catch (e: any) {
        setCurrentWeather(null);
        setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Network error reaching Open-Meteo API: ${e.message}` }]);
        setLoading(false); return;
      }
    } else {
      // optional: Clear weather widget when asking non-weather requests
      setCurrentWeather(null);
    }

    try {
      const openRouterHistory = messages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      const fetchMessages = [
        ...openRouterHistory,
        { role: 'user', content: userMessage + promptAddition }
      ];

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'HTTP-Referer': 'https://alistogo.com',
          'X-Title': 'Alisto:Go',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: fetchMessages,
          temperature: 0.7,
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content || "No response generated.";

      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alisto AI</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >

        {/* API Keys Integration Display */}
        <View style={styles.apiKeysContainer}>
          <Text style={styles.apiKeysTitle}>Active Integrations (DEBUG)</Text>
          <Text style={styles.apiKeyText}>
            Gemini API: {GEMINI_API_KEY ? `Loaded (${GEMINI_API_KEY.length} chars)` : 'Missing (length 0) ❌'}
          </Text>
          <Text style={styles.apiKeyText}>
            Key starts with: {GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 5) + '...' : 'none'}
          </Text>
          <Text style={styles.apiKeyText}>
            Open-Meteo API: Configured ✅ (No Key Required)
          </Text>
        </View>

        {/* Dynamic Weather Widget */}
        {currentWeather && (
          <View style={styles.weatherWidget}>
            <Text style={styles.weatherCity}>{currentWeather.name}</Text>
            <Text style={styles.weatherTemp}>{Math.round(currentWeather.main.temp)}°C</Text>
            <Text style={styles.weatherCondition}>{currentWeather.weather[0].description}</Text>
          </View>
        )}

        {/* Chat Bubbles */}
        {messages.length === 0 && (
          <Text style={styles.emptyState}>Say hello to your Gemini AI assistant!</Text>
        )}
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.role === 'user' ? styles.userText : styles.aiText
            ]}>
              {msg.content}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageBubble, styles.aiBubble, { alignSelf: 'flex-start', padding: 16 }]}>
            <ActivityIndicator size="small" color="#6200ee" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Alisto anything..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },

  /* API Key UI */
  apiKeysContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  apiKeysTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#6200ee',
  },
  apiKeyText: {
    fontSize: 12,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },

  /* Premium Weather Widget */
  weatherWidget: {
    padding: 24,
    backgroundColor: '#14294b', // beautiful blue shade
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#14294b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  weatherCity: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  weatherTemp: {
    fontSize: 56,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: '500',
  },

  emptyState: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 12,
    backgroundColor: '#fafafa',
    color: '#333',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    borderRadius: 25,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
