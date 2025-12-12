import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    ScrollViewProps,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type StatusBarStyle = 'auto' | 'light' | 'dark' | 'hidden';
type PaddingSize = keyof typeof spacing;

interface ScreenHeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
  hideBottomBorder?: boolean;
}

interface ScreenProps {
  children: React.ReactNode;
  
  // Safe Area
  edges?: Edge[];
  unsafe?: boolean;
  
  // Status Bar
  statusBar?: StatusBarStyle;
  statusBarColor?: string;
  
  // Scroll
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  
  // Keyboard
  keyboardAware?: boolean;
  keyboardDismiss?: 'on-drag' | 'interactive' | 'none';
  
  // Style
  backgroundColor?: string;
  paddingHorizontal?: PaddingSize;
  paddingVertical?: PaddingSize;
  noPadding?: boolean;
  style?: ViewStyle;
  
  // States
  loading?: boolean;
  loadingText?: string;
  error?: string | null;
  onRetry?: () => void;
  
  // Header
  header?: ScreenHeaderProps;
}

function ScreenHeader({
  title,
  left,
  right,
  style,
  hideBottomBorder,
}: ScreenHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: hideBottomBorder ? 0 : 1,
        },
        style,
      ]}
    >
      <View style={styles.headerLeft}>{left}</View>
      
      {title && (
        <View style={styles.headerCenter}>
          <Text
            style={[styles.headerTitle, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
      
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

function LoadingState({ text }: { text?: string }) {
  const { theme } = useTheme();

  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {text && (
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.centerContainer}>
      <Text style={[styles.errorText, { color: theme.colors.error }]}>
        {message}
      </Text>
      {onRetry && (
        <Pressable
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Screen({
  children,
  edges = ['top', 'bottom'],
  unsafe = false,
  statusBar = 'auto',
  statusBarColor,
  scroll = false,
  scrollProps,
  keyboardAware = false,
  keyboardDismiss = 'interactive',
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
  noPadding = false,
  style,
  loading = false,
  loadingText,
  error,
  onRetry,
  header,
}: ScreenProps) {
  const { theme, isDark } = useTheme();

  // Status bar style
  const getStatusBarStyle = () => {
    if (statusBar === 'hidden') return null;
    if (statusBar === 'auto') {
      return isDark ? 'light-content' : 'dark-content';
    }
    return statusBar === 'light' ? 'light-content' : 'dark-content';
  };

  const statusBarStyle = getStatusBarStyle();

  // Container style
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.background,
    paddingHorizontal: noPadding
      ? 0
      : paddingHorizontal
      ? spacing[paddingHorizontal]
      : 0,
    paddingVertical: noPadding
      ? 0
      : paddingVertical
      ? spacing[paddingVertical]
      : 0,
  };

  // Content
  const renderContent = () => {
    if (loading) {
      return <LoadingState text={loadingText} />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={onRetry} />;
    }

    return children;
  };

  // Wrapper components
  const SafeArea = unsafe ? View : SafeAreaView;
  const ScrollWrapper = scroll ? ScrollView : View;
  const KeyboardWrapper = keyboardAware ? KeyboardAvoidingView : View;

  const scrollViewProps: ScrollViewProps = scroll
    ? {
        showsVerticalScrollIndicator: false,
        keyboardDismissMode: keyboardDismiss,
        ...scrollProps,
      }
    : {};

  const keyboardProps = keyboardAware
    ? {
        behavior: (Platform.OS === 'ios' ? 'padding' : 'height') as 'padding' | 'height',
        keyboardVerticalOffset: Platform.OS === 'ios' ? 0 : 20,
      }
    : {};

  return (
    <SafeArea
      edges={unsafe ? undefined : edges}
      style={[containerStyle, style]}
    >
      {statusBarStyle && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarColor || theme.colors.background}
        />
      )}

      {header && <ScreenHeader {...header} />}

      <KeyboardWrapper style={{ flex: 1 }} {...keyboardProps}>
        <ScrollWrapper
          style={{ flex: 1 }}
          contentContainerStyle={scroll ? { flexGrow: 1 } : undefined}
          {...scrollViewProps}
        >
          {renderContent()}
        </ScrollWrapper>
      </KeyboardWrapper>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
  },
  errorText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
