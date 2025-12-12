import { PermissionCard } from "@/components/ui";
import { usePermissionPrompt } from "@/hooks/usePermissionPrompt";
import { AuthProvider } from "@/providers/AuthProvider";
import { OnboardingProvider } from "@/providers/OnboardingProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { registerForPushNotificationsAsync } from "@/utils/expo-push";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Bell } from "lucide-react-native";
import { useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Vous pouvez ajouter vos polices personnalisées ici
    // 'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
  });

  const { permissionState, showPermissionPrompt, hidePermissionPrompt } = usePermissionPrompt();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Enregistrer le push token au démarrage
  useEffect(() => {
    const setupPushNotifications = async () => {
      await registerForPushNotificationsAsync(() => {
        // Callback si permission refusée
        showPermissionPrompt(
          'notifications',
          'Activer les notifications',
          'Pour recevoir des notifications importantes, veuillez activer les notifications dans les paramètres de votre appareil.'
        );
      });
    };

    if (fontsLoaded || fontError) {
      setupPushNotifications();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <OnboardingProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(demo)" options={{ headerShown: false }} />
              </Stack>

              {/* Permission Card */}
              <PermissionCard
                visible={permissionState.visible}
                type={permissionState.type}
                title={permissionState.title}
                message={permissionState.message}
                icon={<Bell size={60} color="#FFFFFF" />}
                onDismiss={hidePermissionPrompt}
                onLater={hidePermissionPrompt}
              />
            </AuthProvider>
          </OnboardingProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
