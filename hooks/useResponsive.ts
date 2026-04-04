// hooks/useResponsive.ts
import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints based on standard device widths:
 * - phone: < 768px (standard phone width)
 * - tablet: 768px - 1024px (iPad Mini, iPad Air, Android Tablets)
 * - desktop: > 1024px (iPad Pro 12.9, Web, Desktop browsers)
 */
export const BREAKPOINTS = {
  TABLET: 768,
  DESKTOP: 1024,
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isPhone = width < BREAKPOINTS.TABLET;
  const isTablet = width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.DESKTOP;
  const isDesktop = width >= BREAKPOINTS.DESKTOP;
  const isLargeScreen = width >= BREAKPOINTS.TABLET;

  // Dynamic spacing based on screen size
  const spacing = {
    xs: isPhone ? 4 : 6,
    sm: isPhone ? 8 : 12,
    md: isPhone ? 16 : 24,
    lg: isPhone ? 24 : 32,
    xl: isPhone ? 32 : 48,
  };

  // responsive layout values
  const layout = {
    contentWidth: isPhone ? '100%' : isTablet ? '90%' : '80%',
    columnCount: isPhone ? 1 : isTablet ? 2 : 3,
    horizontalPadding: isPhone ? 16 : isTablet ? 40 : 80,
    cardBorderRadius: isPhone ? 16 : 24,
  };

  return {
    width,
    height,
    isPhone,
    isTablet,
    isDesktop,
    isLargeScreen,
    spacing,
    layout,
  };
};
