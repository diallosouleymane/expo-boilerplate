import { useOnboardingStore } from '@/stores';
import React, { createContext, useContext, useEffect } from 'react';

type OnboardingContextType = {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  isLoading: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { hasSeenOnboarding, completeOnboarding, isLoading, setLoading } = useOnboardingStore();

  useEffect(() => {
    // Démarrer le loading au montage
    setLoading(true);
    // Le store Zustand va automatiquement charger les données
    // et appeler onRehydrateStorage qui mettra isLoading à false
  }, []);

  return (
    <OnboardingContext.Provider value={{ hasSeenOnboarding, completeOnboarding, isLoading }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding doit être utilisé dans OnboardingProvider');
  }
  return context;
}
