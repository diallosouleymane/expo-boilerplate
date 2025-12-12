import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.sm,
    },
    md: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.md,
    },
    lg: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: fontSize.md,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
      textColor: '#FFFFFF',
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderColor: 'transparent',
      textColor: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
      textColor: theme.colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.primary,
    },
    danger: {
      backgroundColor: theme.colors.error,
      borderColor: 'transparent',
      textColor: '#FFFFFF',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          opacity: pressed ? 0.7 : disabled || loading ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              {
                fontSize: currentSize.fontSize,
                color: currentVariant.textColor,
                marginLeft: icon ? spacing.sm : 0,
              },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.semibold,
  },
});
