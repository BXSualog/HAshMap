// app/_layout.tsx — Root Layout
import { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeNotifications } from '../services/notificationService';
import '../tasks/backgroundWeather'; // Register background task definitions
import { auth, onAuthStateChanged } from 'alisto-login';

// Initialize notifications setup (safely handled for Expo Go)
initializeNotifications();

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();

  // Handle user state changes
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  // Auth routing logic
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If user is not logged in and not in the auth group, send them to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If user is logged in and in the auth group, send them to the main app
      router.replace('/(tabs)');
    }
  }, [user, segments, initializing]);

  useEffect(() => {
    // Hide splash after a brief moment
    const hide = setTimeout(() => SplashScreen.hideAsync(), 500);
    return () => clearTimeout(hide);
  }, []);

  if (initializing) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
