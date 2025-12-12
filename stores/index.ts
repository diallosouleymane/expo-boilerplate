import { zustandSecureStore } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            onboardingCompleted: false,
            setOnboardingCompleted: (completed: boolean) =>
                set({ onboardingCompleted: completed }),
        }),
        {
            name: 'jurici-storage',
            storage: createJSONStorage(() => zustandSecureStore),
        }
    )
);