# AlistoAI — Typhoon Alert & AI Weather App

An AI-powered typhoon monitoring and alert system for the Philippines, built with **React Native + Expo SDK 55** and **EAS Build**.

---

## ✨ Features

- 🌍 **Real-Time Weather Tracking** — Live conditions via OpenWeatherMap
- 🚨 **Typhoon Signal Alerts** — Signal #1–#5 detection with push notifications
- 🤖 **AI Chat (Gemini)** — Context-aware weather assistant powered by Google Gemini
- 📍 **GPS Location** — Auto-detect with manual override
- 📴 **Offline Mode** — Last cached weather data shown when offline
- 🔔 **Background Monitoring** — Periodic checks even when app is closed
- 🎨 **Dynamic UI** — Glassmorphism, gradient backgrounds that change with weather

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### 2. Clone & Install

```bash
cd AlistoAI
npm install
```

### 3. Configure API Keys

Create a `.env` file in the root (already present):

```env
OPENWEATHER_API_KEY=your_openweathermap_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Get your keys:**
- 🌤️ OpenWeatherMap (free): https://openweathermap.org/api → "One Call API 3.0"
- 🤖 Gemini: https://aistudio.google.com/app/apikey

### 4. Run Development Build

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your Android/iOS device.

> ⚠️ Push notifications and background tasks require a **physical device** (not simulator).

---

## 🏗️ EAS Build

### Login to EAS
```bash
eas login
eas build:configure
```

### Build Preview APK (Android)
```bash
eas build --platform android --profile preview
```

### Build Production
```bash
eas build --platform android --profile production
```

---

## 📁 Project Structure

```
AlistoAI/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Dashboard
│   │   ├── alerts.tsx       # Alert History
│   │   ├── chat.tsx         # AI Chat
│   │   ├── settings.tsx     # Settings
│   │   └── _layout.tsx      # Tab navigation
│   └── _layout.tsx          # Root layout
├── components/              # Reusable UI components
├── services/                # API integrations
├── hooks/                   # Custom React hooks
├── store/                   # Zustand global state
├── utils/                   # Constants, helpers, signal detection
├── tasks/                   # Background fetch tasks
├── theme/                   # Colors & typography
├── types/                   # TypeScript types
├── .env                     # API keys (not committed)
├── app.config.js            # Expo config
└── eas.json                 # EAS Build profiles
```

---

## 🔔 Typhoon Signal Levels

| Signal | Wind Speed | Color | Action |
|--------|-----------|-------|--------|
| #1 | 30–60 km/h | 🟡 Yellow | Monitor |
| #2 | 60–120 km/h | 🟠 Orange | Consider evacuation |
| #3 | 120–170 km/h | 🔴 Red | Evacuate immediately |
| #4 | 170–220 km/h | 🟣 Purple | Emergency |
| #5 | >220 km/h | ⚫ Dark Red | Catastrophic |

---

## 🤖 AI Chat Examples

Ask AlistoAI:
- *"Is it safe to go outside?"*
- *"What's the typhoon status in Manila?"*
- *"Give me evacuation tips for Signal #3"*
- *"Will it rain tomorrow?"*

---

## 📞 Emergency Numbers

| Agency | Number |
|--------|--------|
| NDRRMC | 911 |
| Red Cross Philippines | 143 |
| PAGASA | +63 2 8284 0800 |
| Philippine Coast Guard | 5100 |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 55 |
| Build | EAS Build |
| Navigation | Expo Router |
| State | Zustand |
| Weather API | OpenWeatherMap |
| AI | Google Gemini 2.0 Flash |
| Notifications | Expo Notifications |
| Location | Expo Location |
| Storage | AsyncStorage |
| UI | Expo Blur, Linear Gradient, Reanimated |
