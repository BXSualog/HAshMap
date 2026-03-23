// theme/colors.ts

export const palette = {
  // Base
  night: '#0a0e27',
  deepBlue: '#0d1b2a',
  navy: '#1a2744',
  darkSlate: '#1e2a3a',

  // Accent
  cyan: '#00d4ff',
  skyBlue: '#1a73e8',
  electricBlue: '#4cafff',
  periwinkle: '#a5b4fc',

  // Warm / sunny
  sunGold: '#ffd54f',
  sunOrange: '#ff8f00',
  amber: '#ffb74d',

  // Danger / typhoon
  alertRed: '#ef4444',
  alertOrange: '#f97316',
  alertYellow: '#eab308',
  signalPurple: '#7c3aed',

  // Neutral
  white: '#ffffff',
  offWhite: '#e2e8f0',
  lightGrey: '#94a3b8',
  midGrey: '#475569',
  darkGrey: '#1e293b',

  // Glass
  glassLight: 'rgba(255,255,255,0.12)',
  glassDark: 'rgba(10,14,39,0.7)',
  glassBorder: 'rgba(255,255,255,0.18)',

  transparent: 'transparent',
};

export const signalColors: Record<number, string> = {
  0: palette.cyan,
  1: palette.alertYellow,
  2: palette.alertOrange,
  3: palette.alertRed,
  4: palette.signalPurple,
  5: '#4a0000',
};

export const conditionGradients: Record<string, string[]> = {
  clear: ['#1a6b9a', '#f4a444', '#ff7043'],
  clouds: ['#2c3e50', '#4a6280', '#6b8cad'],
  rain: ['#0d1b2a', '#1a3a5c', '#2d6a8f'],
  drizzle: ['#1a2a3a', '#2a4a6a', '#3a6a8a'],
  thunderstorm: ['#0a0a1a', '#1a0a2a', '#2a0a3a'],
  snow: ['#c8d8e8', '#e8f0f8', '#d0e0f0'],
  mist: ['#3a4a5a', '#5a6a7a', '#7a8a9a'],
  typhoon: ['#1a0a0a', '#2a0a1a', '#3a1a0a'],
  storm: ['#0a0a1a', '#1a0a2a', '#3a0a3a'],
};

export const lightTheme = {
  bg: '#f0f4f8',
  card: 'rgba(255,255,255,0.85)',
  text: '#0d1b2a',
  subtext: '#475569',
  border: 'rgba(0,0,0,0.08)',
  tabBar: '#ffffff',
};

export const darkTheme = {
  bg: '#0a0e27',
  card: 'rgba(255,255,255,0.08)',
  text: '#e2e8f0',
  subtext: '#94a3b8',
  border: 'rgba(255,255,255,0.12)',
  tabBar: '#0d1b2a',
};
