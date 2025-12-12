import { useOnboarding } from "@/providers/OnboardingProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasSeenOnboarding } = useOnboarding();

  // Rediriger vers l'onboarding si pas encore vu
  if (!hasSeenOnboarding) {
    return <Redirect href={'/onboarding' as any} />;
  }

  // Rediriger vers la démo (accessible sans authentification)
  return <Redirect href={'/(demo)' as any} />;
}
