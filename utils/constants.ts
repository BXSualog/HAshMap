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

export const PROVINCIAL_HOTLINE = [
  { name: 'ILOILO PDRRMO OPCEN', number: '0920-946-8233' },
  { name: 'ILOILO PDRRMO Landline', number: '(033) 328-79-20' },
  { name: 'Bureau of Fire Protection -ILOILO Province', number: '0928-306-3403' },
  { name: 'ILOILO Police Provincial Office (Security Assistance)', number: '0998-598-6190' },
];

export const HOSPITALS = [
  { name: 'WVMC (Provincial)', number: '(033) 339 7070' },
  { name: 'WVSUMC (Don Benito)', number: '(033) 320 2431' },
  { name: 'St. Paul\'s Hospital', number: '(033) 337 2741' },
  { name: 'Iloilo Doctor\'s Hospital', number: '(033) 337 7702' },
  { name: 'Metro Iloilo Hospital', number: '(033) 327 1527' },
  { name: 'Healthway Qualimed', number: '(033) 500 4000' },
  { name: 'The Medical City', number: '(033) 339 7340' },
  { name: 'Iloilo Mission Hospital', number: '(033) 320 0315' },
  { name: 'Asia Pacific Medical Center', number: '(033) 339 9991' },
  { name: 'Medicus Medical Center', number: '(033) 328 7777' },
];

export const ILOILO_CITY_HOTLINE = [
  { name: 'CDRRMO ICER/USAR', number: '0919-066-1554' },
  { name: 'Iloilo City OP-Cen', number: '0919-066-2333' },
  { name: 'BFP Search & Rescue', number: '0966-052-0061' },
  { name: 'ICPO (Police)', number: '0998-598-6241' },
  { name: 'Red Cross Iloilo', number: '0917-117-0066' },
  { name: 'FEDFIRE', number: '(033) 337-9760' },
  { name: 'ICAG', number: '(033) 337-5931' },
  { name: 'ICTTMO (Traffic Control)', number: '(033) 339-1127' },
];
