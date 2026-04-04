import 'dotenv/config';

export default {
  expo: {
    name: 'Alisto:Go',
    slug: 'alisto-go-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0a0e27',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bxfiles.alistoai',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Alisto:Go needs your location to provide localized typhoon alerts and weather updates.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Alisto:Go needs your location in the background to monitor weather changes and send typhoon alerts.',
        UIBackgroundModes: ['location', 'fetch'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundImage: './assets/android-icon-background.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.bxfiles.alistoai',
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'VIBRATE',
        'WAKE_LOCK',
      ],
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow Alisto:Go to use your location for localized weather alerts.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#1a73e8',
          sounds: [],
        },
      ],
      'expo-background-fetch',
      'expo-task-manager',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
      eas: {
        projectId: 'd2de439f-c9f4-44f2-9b0a-bd4b4dc2cf56',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/d2de439f-c9f4-44f2-9b0a-bd4b4dc2cf56',
    },
    scheme: 'alistogo',
  },
};
