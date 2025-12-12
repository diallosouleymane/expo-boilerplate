import { borderRadius } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    ViewStyle,
} from 'react-native';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline' | 'ghost';
  rounded?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'default',
  rounded = false,
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  };

  const variantStyles = {
    default: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    filled: {
      backgroundColor: theme.colors.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        {
          borderRadius: rounded ? sizeStyles[size].width / 2 : borderRadius.md,
          opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
