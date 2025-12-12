# 🚀 React Native Expo Boilerplate

Un boilerplate moderne et complet pour React Native avec Expo, incluant l'authentification, la gestion des thèmes, et des composants UI réutilisables.

## ✨ Fonctionnalités

- 🔐 **Authentification complète** avec Better Auth
- 🎨 **Système de thème** (clair/sombre/système) avec persistance
- 📱 **Onboarding** avec carrousel interactif
- 🔔 **Notifications Toast** avec geste swipe-to-dismiss
- 🧩 **Composants UI** réutilisables et configurables
- 🛣️ **Navigation** avec Expo Router et route groups
- 💾 **Stockage sécurisé** avec expo-secure-store
- 🎯 **TypeScript** pour une meilleure sécurité de type

## 📋 Prérequis

- Node.js 18+
- pnpm (ou npm/yarn)
- Expo CLI
- Un backend Better Auth configuré

## 🛠️ Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd jurici

# Installer les dépendances
pnpm install

# Configurer l'URL du backend
# Modifier app.json > extra.backendUrl avec votre URL backend
```

## 🏗️ Structure du projet

```
jurici/
├── app/                      # Routes et écrans
│   ├── (auth)/              # Groupe de routes d'authentification
│   │   ├── sign-in.tsx      # Page de connexion
│   │   └── sign-up.tsx      # Page d'inscription
│   ├── (demo)/              # Groupe de routes protégées
│   │   └── index.tsx        # Page de démo des composants
│   ├── _layout.tsx          # Layout racine avec providers
│   ├── index.tsx            # Point d'entrée et logique de routing
│   └── onboarding.tsx       # Écran d'onboarding
├── components/
│   └── ui/                  # Composants UI réutilisables
│       ├── Button.tsx       # Bouton avec variantes et tailles
│       ├── Input.tsx        # Input avec validation et icônes
│       ├── Card.tsx         # Container avec shadow
│       ├── AlertModal.tsx   # Modal d'alerte personnalisée
│       ├── PermissionCard.tsx # Card de demande de permission
│       ├── Screen.tsx       # Wrapper d'écran avec SafeArea, StatusBar, Keyboard
│       ├── IconButton.tsx   # Bouton icône pour headers
│       └── index.ts         # Exports barrel
├── constants/
│   └── theme.ts             # Système de design (couleurs, spacing, etc.)
├── providers/               # Providers React Context
│   ├── ThemeProvider.tsx    # Gestion du thème
│   ├── ToastProvider.tsx    # Système de notifications
│   ├── OnboardingProvider.tsx # État de l'onboarding
│   └── AuthProvider.tsx     # Gestion de l'authentification
├── hooks/
│   └── usePermissionPrompt.ts # Hook pour gérer les prompts de permission
├── utils/
│   ├── expo-push.ts         # Configuration push notifications
│   └── save-push.ts         # Sauvegarde du token backend
├── stores/
│   └── notification.ts      # Store Zustand pour notifications
├── .setup/                  # Scripts de configuration (auto-suppression possible)
│   └── scripts/
│       └── setup-navigation.js # CLI pour générer navigation (tabs/drawer/stack)
└── lib/
    └── auth-client.ts       # Configuration Better Auth
```

## 🔄 Workflow de l'application

### 1. Démarrage de l'application

```
app/_layout.tsx (Root Layout)
    ↓
ThemeProvider (charge le thème depuis SecureStore)
    ↓
ToastProvider (initialise le système de notifications)
    ↓
OnboardingProvider (vérifie si l'onboarding a été complété)
    ↓
AuthProvider (charge la session et gère la protection des routes)
    ↓
Stack Navigator (affiche les écrans)
```

### 2. Flux d'authentification

#### Premier lancement
```
app/index.tsx
    ↓
Vérifie hasSeenOnboarding → false
    ↓
Redirige vers /onboarding
    ↓
L'utilisateur parcourt les 3 slides
    ↓
completeOnboarding() → sauvegarde dans SecureStore
    ↓
Redirige vers /(auth)/sign-in
```

#### Utilisateur non authentifié
```
app/index.tsx
    ↓
Vérifie hasSeenOnboarding → true
    ↓
Redirige vers /(demo)
    ↓
L'utilisateur peut accéder à l'app sans authentification
    ↓
Peut se connecter via le bouton dans l'interface
```

#### Utilisateur authentifié
```
app/index.tsx
    ↓
Vérifie hasSeenOnboarding → true
    ↓
Redirige vers /(demo)
    ↓
Affiche la page de démo avec informations utilisateur
    ↓
Si l'utilisateur va sur (auth) → redirigé vers (demo)
```

### 3. Protection des routes

**AuthProvider** surveille les changements de route et de session :

```typescript
// Si l'utilisateur accède à (auth) alors qu'il est connecté
if (session && inAuthGroup) {
  router.replace("/(demo)");
}

// L'utilisateur peut accéder à (demo) sans authentification
// Permet un accès libre au contenu de l'application
```

### 4. Système de thème

```
ThemeProvider
    ↓
Charge themeMode depuis SecureStore
    ↓
Si mode = "system" → utilise useColorScheme()
Si mode = "light" → utilise lightColors
Si mode = "dark" → utilise darkColors
    ↓
Fournit theme object aux composants enfants
    ↓
Tout changement est persisté dans SecureStore
```

### 5. Notifications Toast

```typescript
// Utilisation
const toast = useToast();
toast.success("Message de succès");

// Fonctionnement
ToastProvider
    ↓
Gère une file de toasts avec état et animations
    ↓
PanResponder détecte les gestes swipe
    ↓
Si dy < -50 ou vy < -0.5 → ferme vers le haut
Si |dx| > 100 ou |vx| > 0.5 → ferme vers la gauche/droite
    ↓
Auto-dismiss après 3 secondes (configurable)
```

## 🎨 Composants UI

### Button

```tsx
<Button
  title="Mon bouton"
  variant="primary" // primary, secondary, outline, ghost, danger
  size="md" // sm, md, lg
  onPress={() => {}}
  icon={<Icon />}
  fullWidth
  disabled
  loading
/>
```

**Variantes disponibles :**
- `primary` - Bouton bleu principal
- `secondary` - Bouton violet secondaire
- `outline` - Bouton avec bordure
- `ghost` - Bouton transparent
- `danger` - Bouton rouge pour actions destructives

### Input

```tsx
<Input
  label="Email"
  placeholder="exemple@email.com"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Mail />}
  rightIcon={<Eye />}
  error="Message d'erreur"
  keyboardType="email-address"
  secureTextEntry
/>
```

### Card

```tsx
<Card shadow="md"> // sm, md, lg, none
  <Text>Contenu</Text>
</Card>
```

### Toast

```tsx
const toast = useToast();

toast.success("Succès");
toast.error("Erreur");
toast.warning("Attention");
toast.info("Information");
```

**Fonctionnalités :**
- Swipe vers le haut, gauche ou droite pour fermer
- Auto-dismiss après 3 secondes
- Support des emojis
- Animations fluides

### AlertModal

```tsx
const [showAlert, setShowAlert] = useState(false);

<AlertModal
  visible={showAlert}
  title="Confirmation"
  message="Êtes-vous sûr ?"
  buttons={[
    {
      text: 'Annuler',
      style: 'cancel',
    },
    {
      text: 'Confirmer',
      style: 'default',
      onPress: () => console.log('Confirmé'),
    },
  ]}
  onDismiss={() => setShowAlert(false)}
/>
```

**Styles de boutons :**
- `default` - Bouton primary bleu
- `cancel` - Bouton outline
- `destructive` - Bouton rouge danger

### PermissionCard

```tsx
const [showPermission, setShowPermission] = useState(false);

<PermissionCard
  visible={showPermission}
  type="notifications"
  title="Activer les notifications"
  message="Pour recevoir des notifications importantes, veuillez activer les notifications dans les paramètres."
  icon={<Bell size={60} color="#FFFFFF" />}
  onDismiss={() => setShowPermission(false)}
  onLater={() => console.log('Plus tard')}
/>
```

**Types de permissions :**
- `notifications` - Notifications push
- `location` - Localisation GPS
- `camera` - Caméra
- `microphone` - Microphone
- `photos` - Galerie photos
- `contacts` - Contacts
- `calendar` - Calendrier

**Fonctionnalités :**
- Design inspiré de WhatsApp
- Moitié supérieure colorée avec icône
- Message clair et boutons d'action
- Redirection automatique vers les paramètres
- Animations fluides

### Screen

Wrapper d'écran qui élimine le code boilerplate répétitif et gère automatiquement SafeArea, StatusBar, Keyboard, et états de chargement/erreur.

```tsx
import { Screen, IconButton } from '@/components/ui';
import { Bell, Settings } from 'lucide-react-native';

// Écran simple
<Screen
  header={{
    title: "Mon écran",
  }}
>
  <View>{/* Contenu */}</View>
</Screen>

// Écran avec header personnalisé
<Screen
  header={{
    title: "Messages",
    left: (
      <IconButton
        icon={Bell}
        onPress={() => console.log('Notifications')}
        rounded
      />
    ),
    right: (
      <IconButton
        icon={Settings}
        onPress={() => console.log('Paramètres')}
        variant="ghost"
      />
    ),
  }}
  scroll
  keyboardAware
>
  <View>{/* Contenu scrollable */}</View>
</Screen>

// Écran avec état de chargement
<Screen
  loading={isLoading}
  loadingText="Chargement..."
>
  <View>{/* Contenu */}</View>
</Screen>

// Écran avec gestion d'erreur
<Screen
  error={error}
  onRetry={() => refetch()}
>
  <View>{/* Contenu */}</View>
</Screen>
```

**Props principales :**
- `header` - Configuration du header (title, left, right, center)
- `edges` - Edges SafeArea à appliquer (default: ['top', 'bottom'])
- `unsafe` - Désactive SafeArea complètement
- `statusBar` - Config StatusBar (style: 'auto' | 'light' | 'dark', color)
- `scroll` - Active ScrollView
- `keyboardAware` - Active KeyboardAvoidingView
- `loading` - Affiche spinner de chargement
- `error` - Affiche état d'erreur avec bouton retry
- `backgroundColor` - Couleur de fond personnalisée
- `paddingHorizontal/Vertical` - Padding personnalisé

**Architecture :**
```
Screen
  └─ SafeAreaProvider (dans _layout.tsx)
      └─ StatusBar (gestion auto selon thème)
          └─ SafeAreaView (edges configurables)
              └─ KeyboardAvoidingView (si keyboardAware)
                  └─ ScrollView (si scroll) OU View
                      └─ LoadingState / ErrorState / Content
```

### IconButton

Bouton icône pour headers et toolbars.

```tsx
import { IconButton } from '@/components/ui';
import { Search, Plus, MoreVertical } from 'lucide-react-native';

// Bouton par défaut
<IconButton
  icon={Search}
  onPress={() => console.log('Search')}
/>

// Bouton rempli circulaire
<IconButton
  icon={Plus}
  variant="filled"
  rounded
  onPress={() => console.log('Add')}
/>

// Bouton outline avec taille custom
<IconButton
  icon={MoreVertical}
  variant="outline"
  size="lg"
  onPress={() => console.log('More')}
/>
```

**Variantes :**
- `default` - Transparent avec texte coloré
- `filled` - Fond coloré avec icône blanche
- `outline` - Bordure colorée
- `ghost` - Transparent avec légère opacité au press

**Tailles :**
- `sm` - 32x32px, icône 18px
- `md` - 40x40px, icône 20px (default)
- `lg` - 48x48px, icône 24px

**Props :**
- `rounded` - Forme circulaire au lieu de carrée arrondie

## 🎯 Configuration Backend

Modifiez `app.json` pour pointer vers votre backend Better Auth :

```json
{
  "expo": {
    "extra": {
      "backendUrl": "http://192.168.1.123:3000"
    }
  }
}
```

Le client Better Auth est configuré dans `lib/auth-client.ts` avec :
- Plugin Expo pour le stockage natif
- SecureStore pour la persistance des sessions
- Schéma personnalisé pour deep linking

## 🚀 Lancement

```bash
# Démarrer en mode développement
pnpm start

# Lancer sur iOS
pnpm ios

# Lancer sur Android
pnpm android

# Lancer sur Web
pnpm web

# Configurer la navigation (tabs/drawer/stack)
pnpm setup:navigation
```

## 🛣️ Setup Navigation (CLI)

Le boilerplate inclut un script CLI interactif pour générer rapidement une structure de navigation :

```bash
pnpm setup:navigation
```

**Fonctionnalités du CLI :**
- 📑 **Navigation Tabs** - Génère une navigation par onglets avec :
  - 2 à 5 onglets personnalisables
  - Icônes Lucide personnalisées
  - Badges optionnels sur les onglets
  - Animations de transition
  
- 📚 **Navigation Drawer** - Génère un menu latéral avec :
  - Header personnalisé
  - Profil utilisateur dans le drawer
  - Sections groupées
  - 4 écrans par défaut (Accueil, Profil, Paramètres, À propos)
  
- 📱 **Navigation Stack** - Génère une navigation empilée avec :
  - Pages de détails
  - Modales
  - Navigation back automatique

**Ce que le script fait :**
1. Installe automatiquement `inquirer` pour les prompts interactifs
2. Installe les dépendances nécessaires (gesture-handler, reanimated pour drawer)
3. Crée les fichiers dans `app/(tabs)/`, `app/(drawer)/` ou `app/(stack)/`
4. Utilise automatiquement vos composants `Screen`, `Button`, `IconButton`
5. Applique le système de thème
6. Propose de se supprimer après utilisation (ainsi que le dossier `.setup/`)

**Exemple de structure générée (Tabs) :**
```
app/
├── (tabs)/
│   ├── _layout.tsx          # Configuration tabs avec icônes
│   ├── index.tsx            # Onglet Accueil
│   ├── explore.tsx          # Onglet Explorer
│   └── profile.tsx          # Onglet Profil
```

**Personnalisation :**
Tous les écrans générés utilisent le composant `Screen` et sont entièrement personnalisables après génération.

## 🔐 Stockage sécurisé

L'application utilise `expo-secure-store` pour stocker de manière sécurisée :
- **Session d'authentification** (`@better-auth/*`)
- **Mode de thème** (`@theme-mode`)
- **État de l'onboarding** (`@onboarding-complete`)

## 📱 Route Groups

### (auth)
Routes publiques pour l'authentification :
- `/(auth)/sign-in` - Connexion
- `/(auth)/sign-up` - Inscription

### (demo)
Routes de démonstration (accessibles sans authentification) :
- `/(demo)/` - Page de démo des composants

**Note :** L'authentification n'est pas obligatoire pour accéder à l'application. Les utilisateurs peuvent naviguer librement et se connecter quand ils le souhaitent. Cela permet de créer des apps avec du contenu public et des fonctionnalités premium réservées aux utilisateurs connectés.

## 🎨 Personnalisation du thème

Modifiez `constants/theme.ts` pour personnaliser :
- Couleurs (light/dark)
- Espacements
- Tailles de police
- Poids de police
- Border radius
- Ombres

```typescript
export const lightColors = {
  primary: '#007AFF',
  background: '#FFFFFF',
  // ... autres couleurs
};

export const darkColors = {
  primary: '#0A84FF',
  background: '#000000',
  // ... autres couleurs
};
```

## 📝 Ajouter une nouvelle route protégée

1. Créer un nouveau fichier dans `app/(demo)/`
2. L'accès est libre par défaut, utilisez `useAuth()` pour vérifier la session si nécessaire
3. Utiliser les composants UI et le thème

```tsx
// app/(demo)/profile.tsx
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Card, Button, AlertModal } from '@/components/ui';

export default function Profile() {
  const { theme } = useTheme();
  const { session } = useAuth();
  
  // Vérifier manuellement si besoin
  if (!session) {
    return (
      <Card>
        <Text style={{ color: theme.colors.text }}>
          Connectez-vous pour voir votre profil
        </Text>
      </Card>
    );
  }
  
  return (
    <Card>
      <Text style={{ color: theme.colors.text }}>
        Mon profil : {session.user.email}
      </Text>
    </Card>
  );
}
```

## 🧪 Tests des composants

La page `/(demo)/` sert de showcase et permet de tester :
- **Boutons** : Toutes les variantes (primary, secondary, outline, ghost, danger) et tailles (sm, md, lg)
- **Inputs** : Avec icônes, états d'erreur, validation
- **Toasts** : 4 types avec swipe-to-dismiss (success, error, warning, info)
- **Cards** : Différentes ombres (sm, md, lg, none)
- **AlertModal** : 3 types d'alertes (simple, confirmation, destructive)
- **PermissionCard** : 3 exemples (notifications, camera, location)
- **Screen** : Wrapper d'écran avec header personnalisable
- **IconButton** : Boutons icône avec variantes et tailles
- **Thème** : Changement entre clair/sombre/système

## 🔔 Push Notifications

Le boilerplate intègre un système complet de push notifications :

**Enregistrement automatique :**
- Au démarrage de l'app dans `_layout.tsx`
- Demande de permission si nécessaire
- Sauvegarde du token dans Zustand store
- Envoi du token au backend

**Gestion des permissions refusées :**
- Affichage automatique d'une `PermissionCard`
- Redirection vers les paramètres système
- Compatible iOS et Android (Expo Go + standalone)

**Configuration :**
```typescript
// utils/expo-push.ts
await registerForPushNotificationsAsync(() => {
  // Callback si permission refusée
  showPermissionPrompt('notifications', 'Titre', 'Message');
});
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 🙏 Remerciements

- [Expo](https://expo.dev/)
- [Better Auth](https://www.better-auth.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)