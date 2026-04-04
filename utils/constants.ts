// utils/constants.ts

export const BACKGROUND_WEATHER_TASK = 'BACKGROUND_WEATHER_FETCH';
export const WEATHER_FETCH_INTERVAL = 15; // minutes
export const HEAT_INDEX_THRESHOLD = 38;

export const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

import { TyphoonSignal } from '../types';

export const TYPHOON_SIGNAL_INFO: Record<TyphoonSignal, {
  label: string;
  color: string;
  icon: string;
  description: string;
  tips: string[];
}> = {
  0: {
    label: 'No Active Signal',
    color: '#00d4ff',
    icon: '✅',
    description: 'No typhoon threat at this time.',
    tips: [],
  },
  1: {
    label: 'Signal #1',
    color: '#eab308',
    icon: '⚠️',
    description:
      'Winds of 30–60 km/h expected within 36 hours. Minimal threat to life and property.',
    tips: [
      'Monitor weather updates regularly.',
      'Secure loose outdoor objects.',
      'Prepare an emergency kit.',
    ],
  },
  2: {
    label: 'Signal #2',
    color: '#f97316',
    icon: '🚨',
    description:
      'Winds of 60–120 km/h within 24 hours. Moderate threat — consider evacuation of low-lying areas.',
    tips: [
      'Evacuate low-lying and flood-prone areas.',
      'Avoid unnecessary travel.',
      'Stock up on food and water for 3 days.',
      'Charge all devices and power banks.',
    ],
  },
  3: {
    label: 'Signal #3',
    color: '#ef4444',
    icon: '🔴',
    description:
      'Winds of 120–170 km/h within 18 hours. Significant threat — evacuate immediately if instructed.',
    tips: [
      'EVACUATE IMMEDIATELY if in danger zones.',
      'Follow local government evacuation orders.',
      'Do NOT cross swollen rivers or flooded roads.',
      'Bring important documents and medications.',
      'Go to the nearest evacuation center.',
    ],
  },
  4: {
    label: 'Signal #4',
    color: '#7c3aed',
    icon: '🆘',
    description:
      'Winds of 170–220 km/h within 12 hours. Extreme threat — immediate evacuation required.',
    tips: [
      'EVACUATE IMMEDIATELY — do not wait.',
      'Seek sturdy shelter away from coastal areas.',
      'Stay away from windows and exterior walls.',
      'Listen only to official emergency broadcasts.',
    ],
  },
  5: {
    label: 'Signal #5',
    color: '#4a0000',
    icon: '☠️',
    description:
      'Winds exceeding 220 km/h. Catastrophic — stay in the strongest room of the building.',
    tips: [
      'If evacuation was not completed — seek interior room on the highest floor.',
      'Stay AWAY from all windows.',
      'Do NOT go outside under any circumstances.',
      'Alert rescuers by text; conserve phone battery.',
    ],
  },
};

export const EMERGENCY_NUMBERS = [
  { name: 'NDRRMC Hotline', number: '911' },
  { name: 'Red Cross Philippines', number: '143' },
  { name: 'PAGASA', number: '+63 2 8284 0800' },
  { name: 'Philippine Coast Guard', number: '5100' },
];
