
import { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeNotifications } from '../services/notificationService';
import '../tasks/backgroundWeather';
import { auth } from 'alisto-login';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAppStore } from '../store/useAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import Onboarding from '../components/Onboarding';
import TermsAndConditions from '../components/TermsAndConditions';

initializeNotifications();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { isOnboardingComplete, setOnboardingComplete, isTermsAgreed, setTermsAgreed } = useAppStore();
  const segments = useSegments();
  const router = useRouter();


  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });


  useEffect(() => {
    const checkStatus = async () => {
      const [onboardingValue, termsValue] = await Promise.all([
        AsyncStorage.getItem('HAS_COMPLETED_ONBOARDING'),
        AsyncStorage.getItem('HAS_AGREED_TO_TERMS'),
      ]);
      
      if (onboardingValue === 'true') {
        setOnboardingComplete(true);
      }
      if (termsValue === 'true') {
        setTermsAgreed(true);
      }
    };
    checkStatus();
  }, []);

  // Handle user state changes
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      useAppStore.getState().setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  useEffect(() => {
    if (initializing || !fontsLoaded) return;

    if (!isTermsAgreed) return;
    if (!isOnboardingComplete) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, initializing, fontsLoaded, isOnboardingComplete]);

  useEffect(() => {
    if (!initializing && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [initializing, fontsLoaded]);


  if (initializing || !fontsLoaded) return null;

  if (!isTermsAgreed) {
    return (
      <TermsAndConditions
        onAccept={async () => {
          await AsyncStorage.setItem('HAS_AGREED_TO_TERMS', 'true');
          setTermsAgreed(true);
        }}
      />
    );
  }

  if (!isOnboardingComplete) {
    return (
      <Onboarding
        onComplete={async () => {
          await AsyncStorage.setItem('HAS_COMPLETED_ONBOARDING', 'true');
          setOnboardingComplete(true);
        }}
      />
    );
  }

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
