import { authClient } from '@/lib/auth-client';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect } from 'react';

type AuthContextType = {
  session: typeof authClient.$Infer.Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0]?.toString().includes('auth');

    // Rediriger vers la démo si session active et dans les pages d'auth
    if (session && inAuthGroup) {
      router.replace('/(demo)' as any);
    }
  }, [session, segments, isLoading]);

  const signOut = async () => {
    await authClient.signOut();
    router.replace('/(auth)/sign-in' as any);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
