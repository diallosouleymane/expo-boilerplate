import { zustandSecureStore } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  completeOnboarding: () => void;
  setLoading: (loading: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isLoading: true,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'jurici-onboarding',
      storage: createJSONStorage(() => zustandSecureStore),
      onRehydrateStorage: () => (state) => {
        // Une fois hydraté, on arrête le loading
        state?.setLoading(false);
      },
    }
  )
);
