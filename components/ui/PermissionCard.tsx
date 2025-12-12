import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import * as IntentLauncher from 'expo-intent-launcher';
import React from 'react';
import {
  Animated,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from './Button';

export type PermissionType = 
  | 'notifications' 
  | 'location' 
  | 'camera' 
  | 'microphone' 
  | 'photos' 
  | 'contacts'
  | 'calendar';

interface PermissionCardProps {
  visible: boolean;
  type: PermissionType;
  title: string;
  message: string;
  icon: React.ReactNode;
  onLater?: () => void;
  onOpenSettings?: () => void;
  onDismiss?: () => void;
}

const permissionColors: Record<PermissionType, string> = {
  notifications: '#007AFF',
  location: '#34C759',
  camera: '#FF9500',
  microphone: '#FF3B30',
  photos: '#5856D6',
  contacts: '#0A84FF',
  calendar: '#FF2D55',
};

export function PermissionCard({
  visible,
  type,
  title,
  message,
  icon,
  onLater,
  onOpenSettings,
  onDismiss,
}: PermissionCardProps) {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleOpenSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openSettings();
    } else {
      // Android - ouvre les paramètres de l'app
      const pkg = 'host.exp.exponent'; // Pour Expo Go
      // Pour une app standalone, utilisez votre package name depuis app.json
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        { data: 'package:' + pkg }
      );
    }
    onOpenSettings?.();
    onDismiss?.();
  };

  const handleLater = () => {
    onLater?.();
    onDismiss?.();
  };

  const backgroundColor = permissionColors[type];

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
            styles.card,
            {
              backgroundColor: theme.colors.card,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header avec icône */}
          <View style={[styles.iconContainer, { backgroundColor }]}>
            <View style={styles.iconWrapper}>{icon}</View>
          </View>

          {/* Contenu */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
              {message}
            </Text>
          </View>

          {/* Boutons */}
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Plus tard"
                variant="outline"
                size="md"
                onPress={handleLater}
                fullWidth
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Paramètres"
                variant="primary"
                size="md"
                onPress={handleOpenSettings}
                fullWidth
              />
            </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    zIndex: 2,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  iconContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingTop: 0,
  },
  buttonWrapper: {
    flex: 1,
  },
});
