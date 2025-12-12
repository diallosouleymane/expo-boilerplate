import { create } from "zustand";

type NotificationState = {
  pushToken: string | null;
  setPushToken: (t: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  pushToken: null,
  setPushToken: (t) => set({ pushToken: t }),
}));
