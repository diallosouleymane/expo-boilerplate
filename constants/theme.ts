import { StyleSheet } from 'react-native';

// Couleurs pour le thème clair
export const lightColors = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  secondary: '#5856D6',
  
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Couleurs pour le thème sombre
export const darkColors = {
  primary: '#0A84FF',
  primaryDark: '#0066CC',
  secondary: '#5E5CE6',
  
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  
  border: '#38383A',
  borderLight: '#48484A',
  
  success: '#32D74B',
  error: '#FF453A',
  warning: '#FF9F0A',
  info: '#0A84FF',
  
  card: '#1C1C1E',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Espacements
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tailles de police
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Poids de police
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Ombres
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Styles utilitaires réutilisables
export const createUtilityStyles = (colors: typeof lightColors) => StyleSheet.create({
  // Flex
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  
  // Alignement
  center: { justifyContent: 'center', alignItems: 'center' },
  centerV: { justifyContent: 'center' },
  centerH: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  
  // Spacing
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },
  
  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },
  
  // Padding horizontal/vertical
  pxSm: { paddingHorizontal: spacing.sm },
  pxMd: { paddingHorizontal: spacing.md },
  pxLg: { paddingHorizontal: spacing.lg },
  pySm: { paddingVertical: spacing.sm },
  pyMd: { paddingVertical: spacing.md },
  pyLg: { paddingVertical: spacing.lg },
  
  // Margin horizontal/vertical
  mxSm: { marginHorizontal: spacing.sm },
  mxMd: { marginHorizontal: spacing.md },
  mxLg: { marginHorizontal: spacing.lg },
  mySm: { marginVertical: spacing.sm },
  myMd: { marginVertical: spacing.md },
  myLg: { marginVertical: spacing.lg },
  
  // Gap
  gapXs: { gap: spacing.xs },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },
  
  // Background colors
  bgPrimary: { backgroundColor: colors.primary },
  bgSecondary: { backgroundColor: colors.secondary },
  bgBackground: { backgroundColor: colors.background },
  bgCard: { backgroundColor: colors.card },
  
  // Text colors
  textPrimary: { color: colors.text },
  textSecondary: { color: colors.textSecondary },
  textTertiary: { color: colors.textTertiary },
  textWhite: { color: '#FFFFFF' },
  
  // Border radius
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  roundedFull: { borderRadius: borderRadius.full },
  
  // Border
  border: { 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  borderLight: { 
    borderWidth: 1, 
    borderColor: colors.borderLight 
  },
  
  // Text styles
  textXs: { fontSize: fontSize.xs },
  textSm: { fontSize: fontSize.sm },
  textMd: { fontSize: fontSize.md },
  textLg: { fontSize: fontSize.lg },
  textXl: { fontSize: fontSize.xl },
  textXxl: { fontSize: fontSize.xxl },
  
  textRegular: { fontWeight: fontWeight.regular },
  textMedium: { fontWeight: fontWeight.medium },
  textSemibold: { fontWeight: fontWeight.semibold },
  textBold: { fontWeight: fontWeight.bold },
  
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
});

export type Colors = typeof lightColors;
export type Theme = {
  colors: Colors;
  dark: boolean;
};
