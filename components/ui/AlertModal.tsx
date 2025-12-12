import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from './Button';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export function AlertModal({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
}: AlertModalProps) {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onDismiss?.();
  };

  const getButtonVariant = (style?: string): 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' => {
    switch (style) {
      case 'destructive':
        return 'danger';
      case 'cancel':
        return 'outline';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.overlayBackground,
            {
              opacity: fadeAnim,
            },
          ]}
        />
      </Pressable>

      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.alertBox,
            {
              backgroundColor: theme.colors.card,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View style={[
            styles.buttonsContainer,
            buttons.length === 1 && styles.singleButtonContainer,
          ]}>
            {buttons.map((button, index) => (
              <View
                key={index}
                style={[
                  styles.buttonWrapper,
                  buttons.length === 2 && { flex: 1 },
                  buttons.length === 1 && { flex: 1, maxWidth: 200 },
                ]}
              >
                <Button
                  title={button.text}
                  variant={getButtonVariant(button.style)}
                  size="md"
                  onPress={() => handleButtonPress(button)}
                  fullWidth
                />
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    zIndex: 2,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  singleButtonContainer: {
    justifyContent: 'center',
  },
  buttonWrapper: {
    minWidth: 100,
  },
});
