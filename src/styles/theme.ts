export const theme = {
  // Brand Colors
  colors: {
    primary: '#FF6B6B',
    primaryDark: '#E55A5A',
    primaryLight: '#FF8F8F',
    
    // Neutrals
    black: '#1A1A1A',
    darkGray: '#2D2D2D',
    gray: '#666666',
    lightGray: '#999999',
    paleGray: '#E9ECEF',
    offWhite: '#F8F9FA',
    white: '#FFFFFF',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Background
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F5F6F7',
    
    // Borders
    border: '#E9ECEF',
    borderLight: '#F0F1F2',
    borderDark: '#DEE2E6',
  },

  // Typography
  typography: {
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
    },
    
    // Font Weights
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // Spacing (using 4px base unit)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
  },

  // Border Radius
  borderRadius: {
    sm: 6,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Layout
  layout: {
    headerHeight: 88,
    tabBarHeight: 60,
    contentPadding: 24,
    sectionSpacing: 32,
  },
};

// Common component styles
export const commonStyles = {
  // Headers
  header: {
    backgroundColor: theme.colors.white,
    paddingTop: 50, // Reduced to compensate for larger logo
    paddingBottom: 8,  // Reduced to compensate for larger logo
    paddingHorizontal: theme.layout.contentPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
  },
  
  headerLogo: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.primary,
  },

  // Containers
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollContainer: {
    flex: 1,
    paddingHorizontal: theme.layout.contentPadding,
  },
  
  section: {
    marginBottom: theme.layout.sectionSpacing,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.base,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.base,
  },
  
  cardSecondary: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center' as const,
    ...theme.shadows.base,
  },
  
  buttonPrimaryText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  buttonSecondaryText: {
    color: theme.colors.black,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Inputs
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.black,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray,
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.spacing['2xl'],
  },
  
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  },
  
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.lightGray,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  // Spacing
  bottomSpacing: {
    height: theme.spacing['3xl'],
  },
}; 