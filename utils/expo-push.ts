import { useNotificationStore } from "@/stores/notification";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { savePushToken } from "./save-push";

export async function registerForPushNotificationsAsync(
  onPermissionDenied?: () => void
): Promise<string | null> {
  // ---- Android notification channel ---- //
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0066FF",
    });
  }

  // ---- Physical device check ---- //
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  // ---- Permissions ---- //
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Permission not granted for push notifications");
    onPermissionDenied?.();
    return null;
  }

  // ---- Project ID ---- //
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.error("Expo Project ID not found");
    return null;
  }

  // ---- Get push token ---- //
  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    // ---- Persist in stores ---- //
    useNotificationStore.getState().setPushToken(token);

    // ---- Send to backend ---- //
    try {
        await savePushToken(token);
    } catch (err) {
      console.warn("Failed to save token:", err);
    }

    return token;
  } catch (err) {
    console.error("Push token error:", err);
    return null;
  }
}
