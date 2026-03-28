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
  clear: ['#5451f5ff', '#0689a9ff', '#000000ff'],
  clouds: ['#5b5b5bff', '#b1b1b1ff', '#000000ff'],
  rain: ['#86B9B1', '#4B7273', '#042631'],
  drizzle: ['#C9D6DF', '#99A9B8', '#7D8CA3'],
  thunderstorm: ['#765c96', '#5f3f4d', '#372951'],
  mist: ['#AFB5AE', '#858971', '#3F3F3F'],
  typhoon: ['#6486A1', '#2D79AA', '#0D1F2A'],
  storm: ['#765c96', '#5f3f4d', '#372951'],
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
