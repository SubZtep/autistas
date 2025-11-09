/**
 * Color palette for Autistas app
 * Designed with calm, friendly, and accessible colors in mind
 */

export const Colors = {
  light: {
    // Primary calm blue-green (soothing, non-aggressive)
    primary: '#4A90A4',
    primaryLight: '#7BB5C6',
    primaryDark: '#2C6B7C',

    // Soft backgrounds
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F4F7',

    // Text colors (high contrast for accessibility)
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // Accent colors (soft, friendly)
    accent: '#F59E42', // Warm orange
    accentLight: '#FFB366',

    // Functional colors (calm versions)
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI elements
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    shadow: 'rgba(0, 0, 0, 0.08)',

    // Chat specific
    userMessage: '#E8F3F6',
    aiMessage: '#F0F4F7',
    inputBackground: '#FFFFFF',
  },

  dark: {
    // Primary calm blue-green (adjusted for dark mode)
    primary: '#5AADC2',
    primaryLight: '#7BB5C6',
    primaryDark: '#3D8599',

    // Dark backgrounds (not pure black, easier on eyes)
    background: '#0F1419',
    surface: '#1A1F26',
    surfaceSecondary: '#252B33',

    // Text colors (high contrast for accessibility)
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',

    // Accent colors (slightly muted for dark mode)
    accent: '#F59E42',
    accentLight: '#FFB366',

    // Functional colors (adjusted for dark mode)
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    // UI elements
    border: '#374151',
    borderLight: '#2D3748',
    shadow: 'rgba(0, 0, 0, 0.3)',

    // Chat specific
    userMessage: '#1E3A42',
    aiMessage: '#252B33',
    inputBackground: '#1A1F26',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
