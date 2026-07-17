export const lightTheme = {
  colors: {
    primary: '#f4f3ee',
    accent: '#c15f3c',
    background: '#f4f3ee',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    verified: '#c15f3c',
  },
  fonts: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

export const darkTheme = {
  colors: {
    primary: '#1a1a1a',
    accent: '#c15f3c',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#f5f5f5',
    textSecondary: '#9ca3af',
    border: '#2d2d2d',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
    verified: '#c15f3c',
  },
  fonts: lightTheme.fonts,
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};

export type AppTheme = typeof lightTheme;
