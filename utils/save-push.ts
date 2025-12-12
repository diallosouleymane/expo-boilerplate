import { api } from "./api";

/**
 * Enregistre ton push token sur ton backend
 * @param token expo push token
 */
export async function savePushToken(token: string) {
  try {
    return await api.post("/notifications/register", { token });
  } catch (err) {
    console.warn("Error saving push token:", err);
    return null;
  }
}
