import 'dotenv/config';

export default {
  expo: {
    name: 'AlistoAI',
    slug: 'alistoai',
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
          'AlistoAI needs your location to provide localized typhoon alerts and weather updates.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'AlistoAI needs your location in the background to monitor weather changes and send typhoon alerts.',
        UIBackgroundModes: ['location', 'fetch'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0a0e27',
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
            'Allow AlistoAI to use your location for localized weather alerts.',
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
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      eas: {
        projectId: 'your-eas-project-id',
      },
    },
    scheme: 'alistoai',
  },
};
