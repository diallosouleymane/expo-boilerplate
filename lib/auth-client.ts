import { env } from "@/utils/env";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: env.BACKEND_URL,
  
  plugins: [
    expoClient({
      // Le scheme défini dans app.json
      scheme: "jurici",
      
      // Préfixe pour le stockage sécurisé
      storagePrefix: "jurici",
      
      // Utilise expo-secure-store pour stocker les cookies et sessions de manière sécurisée
      storage: SecureStore,
    }),
  ],
});

// Export des types pour l'autocomplétion TypeScript
export type Session = typeof authClient.$Infer.Session;
