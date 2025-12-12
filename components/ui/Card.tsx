import { borderRadius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ 
  children, 
  noPadding = false, 
  shadow = 'md',
  style,
  ...props 
}: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          padding: noPadding ? 0 : spacing.md,
        },
        shadow !== 'none' && shadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});
