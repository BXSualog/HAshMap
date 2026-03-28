// Environment variable type declarations for Expo
// EXPO_PUBLIC_* variables are automatically available via process.env in Expo apps
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_GEMINI_API_KEY: string;
  }
}
