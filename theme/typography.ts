// theme/typography.ts
import { Platform, PixelRatio } from 'react-native';

export const fonts = {
  regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' }),
  bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'System' }),
  serif: Platform.select({ ios: 'Iowan Old Style', android: 'serif', default: 'serif' }),
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 52,
};

// Scale font for tablets/large screens
export const getResponsiveFontSize = (size: keyof typeof fontSizes, isLargeScreen: boolean) => {
  const baseSize = fontSizes[size];
  if (!isLargeScreen) return baseSize;
  
  // Scale up by 20% on tablets/larger screens
  return Math.round(baseSize * 1.2);
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

