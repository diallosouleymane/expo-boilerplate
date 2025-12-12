import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react-native';
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const { width } = Dimensions.get('window');

function Toast({ id, message, type, duration = 3000, onDismiss }: ToastProps & { onDismiss: (id: string) => void }) {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-100));
  const [swipeTranslateY] = useState(new Animated.Value(0));
  const [swipeTranslateX] = useState(new Animated.Value(0));

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dy) > 5 || Math.abs(gestureState.dx) > 5;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            swipeTranslateY.setValue(gestureState.dy);
          }
          swipeTranslateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          // Swipe vers le haut
          if (gestureState.dy < -50 || gestureState.vy < -0.5) {
            handleSwipeDismiss('up');
          }
          // Swipe vers la gauche ou la droite
          else if (Math.abs(gestureState.dx) > 100 || Math.abs(gestureState.vx) > 0.5) {
            handleSwipeDismiss(gestureState.dx > 0 ? 'right' : 'left');
          }
          // Retour à la position initiale
          else {
            Animated.parallel([
              Animated.spring(swipeTranslateY, {
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.spring(swipeTranslateX, {
                toValue: 0,
                useNativeDriver: true,
              }),
            ]).start();
          }
        },
      }),
    []
  );

  React.useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipeDismiss = (direction: 'up' | 'left' | 'right') => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ];

    if (direction === 'up') {
      animations.push(
        Animated.timing(swipeTranslateY, {
          toValue: -150,
          duration: 200,
          useNativeDriver: true,
        })
      );
    } else {
      animations.push(
        Animated.timing(swipeTranslateX, {
          toValue: direction === 'left' ? -width : width,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => onDismiss(id));
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(id));
  };

  const getIcon = () => {
    const iconSize = 22;
    const iconColor = '#FFFFFF';

    switch (type) {
      case 'success':
        return <CheckCircle2 size={iconSize} color={iconColor} />;
      case 'error':
        return <XCircle size={iconSize} color={iconColor} />;
      case 'warning':
        return <AlertCircle size={iconSize} color={iconColor} />;
      case 'info':
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
    }
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [
            { translateY },
            { translateY: swipeTranslateY },
            { translateX: swipeTranslateX },
          ],
        },
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <Pressable onPress={handleDismiss} style={styles.closeButton}>
        <X size={18} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé dans un ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg + 2,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    width: width - spacing.md * 2,
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: spacing.sm + 2,
  },
  message: {
    flex: 1,
    fontSize: fontSize.md + 1,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: spacing.sm + 2,
    padding: spacing.xs,
  },
});
