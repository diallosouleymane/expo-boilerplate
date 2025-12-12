#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Check if inquirer is installed
let inquirer;
try {
  inquirer = require('inquirer');
} catch (error) {
  log.error('inquirer n\'est pas installé');
  log.info('Installation en cours...');
  try {
    execSync('pnpm add -D inquirer', { stdio: 'inherit' });
    inquirer = require('inquirer');
    log.success('inquirer installé avec succès');
  } catch (installError) {
    log.error('Échec de l\'installation d\'inquirer');
    process.exit(1);
  }
}

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
const APP_DIR = path.join(PROJECT_ROOT, 'app');

async function main() {
  log.title('🚀 Configuration de la navigation Expo Router');

  // Ask navigation type
  const { navigationType } = await inquirer.default.prompt([
    {
      type: 'list',
      name: 'navigationType',
      message: 'Quel type de navigation souhaitez-vous ?',
      choices: [
        { name: '📑 Tabs (Navigation par onglets)', value: 'tabs' },
        { name: '📚 Drawer (Menu latéral)', value: 'drawer' },
        { name: '📱 Stack (Navigation empilée)', value: 'stack' },
      ],
    },
  ]);

  let features = [];
  
  // Additional features based on navigation type
  if (navigationType === 'tabs') {
    const tabsConfig = await inquirer.default.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Quelles fonctionnalités voulez-vous inclure ?',
        choices: [
          { name: 'Icônes personnalisées', value: 'customIcons', checked: true },
          { name: 'Badge sur les onglets', value: 'badges' },
          { name: 'Animation de transition', value: 'animations' },
        ],
      },
      {
        type: 'input',
        name: 'tabCount',
        message: 'Combien d\'onglets ? (2-5)',
        default: '3',
        validate: (input) => {
          const num = parseInt(input);
          return num >= 2 && num <= 5 ? true : 'Entre 2 et 5 onglets';
        },
      },
    ]);
    features = tabsConfig.features;
    features.tabCount = parseInt(tabsConfig.tabCount);
  } else if (navigationType === 'drawer') {
    const drawerConfig = await inquirer.default.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Quelles fonctionnalités voulez-vous inclure ?',
        choices: [
          { name: 'Header personnalisé', value: 'customHeader', checked: true },
          { name: 'Profil utilisateur dans le drawer', value: 'userProfile' },
          { name: 'Sections groupées', value: 'groupedSections' },
        ],
      },
    ]);
    features = drawerConfig.features;
  }

  // Confirm before proceeding
  const { confirm } = await inquirer.default.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Créer une navigation ${navigationType} ?`,
      default: true,
    },
  ]);

  if (!confirm) {
    log.warning('Configuration annulée');
    process.exit(0);
  }

  // Create navigation structure
  log.info('Création de la structure de navigation...');

  try {
    if (navigationType === 'tabs') {
      await createTabsNavigation(features);
    } else if (navigationType === 'drawer') {
      await createDrawerNavigation(features);
    } else if (navigationType === 'stack') {
      await createStackNavigation();
    }

    log.success('Navigation créée avec succès ! 🎉');
    log.info('\nProchaines étapes:');
    log.info('1. Examinez les fichiers créés dans app/(tabs)/, app/(drawer)/ ou app/(stack)/');
    log.info('2. Personnalisez les écrans selon vos besoins');
    log.info('3. Lancez l\'application: pnpm start');
    
    // Ask if script should delete itself
    const { deleteScript } = await inquirer.default.prompt([
      {
        type: 'confirm',
        name: 'deleteScript',
        message: 'Supprimer ce script de configuration ?',
        default: false,
      },
    ]);

    if (deleteScript) {
      const scriptPath = __filename;
      fs.unlinkSync(scriptPath);
      log.success('Script supprimé');
      
      // Check if .setup directory is empty and delete it
      const setupDir = path.dirname(path.dirname(scriptPath));
      const scriptsDir = path.dirname(scriptPath);
      
      if (fs.readdirSync(scriptsDir).length === 0) {
        fs.rmdirSync(scriptsDir);
      }
      
      if (fs.readdirSync(setupDir).length === 0) {
        fs.rmdirSync(setupDir);
        log.success('Dossier .setup supprimé');
      }
    }

  } catch (error) {
    log.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

async function createTabsNavigation(features) {
  const tabCount = features.tabCount || 3;
  const hasCustomIcons = features.includes('customIcons');
  const hasBadges = features.includes('badges');
  const hasAnimations = features.includes('animations');

  // Create (tabs) directory
  const tabsDir = path.join(APP_DIR, '(tabs)');
  if (!fs.existsSync(tabsDir)) {
    fs.mkdirSync(tabsDir, { recursive: true });
  }

  // Tab names and icons
  const tabConfigs = [
    { name: 'index', title: 'Accueil', icon: 'Home' },
    { name: 'explore', title: 'Explorer', icon: 'Compass' },
    { name: 'profile', title: 'Profil', icon: 'User' },
    { name: 'settings', title: 'Paramètres', icon: 'Settings' },
    { name: 'notifications', title: 'Notifications', icon: 'Bell' },
  ].slice(0, tabCount);

  // Create _layout.tsx for tabs
  const layoutContent = `import { Tabs } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
${hasCustomIcons ? `import { ${tabConfigs.map(t => t.icon).join(', ')} } from 'lucide-react-native';` : ''}

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          ${hasAnimations ? 'elevation: 0,' : ''}
        },
        ${hasAnimations ? 'tabBarHideOnKeyboard: true,' : ''}
      }}
    >
${tabConfigs.map((tab, index) => `      <Tabs.Screen
        name="${tab.name}"
        options={{
          title: '${tab.title}',
          ${hasCustomIcons ? `tabBarIcon: ({ color, size }) => <${tab.icon} size={size} color={color} />,` : ''}
          ${hasBadges && index === 0 ? 'tabBarBadge: 3,' : ''}
        }}
      />`).join('\n')}
    </Tabs>
  );
}
`;

  fs.writeFileSync(path.join(tabsDir, '_layout.tsx'), layoutContent);

  // Create individual tab screens
  tabConfigs.forEach((tab) => {
    const screenContent = `import { Screen } from '@/components/ui';
import { View, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export default function ${tab.title.replace(/\s/g, '')}Screen() {
  const { theme } = useTheme();

  return (
    <Screen
      header={{
        title: '${tab.title}',
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          ${tab.title}
        </Text>
      </View>
    </Screen>
  );
}
`;
    fs.writeFileSync(path.join(tabsDir, `${tab.name}.tsx`), screenContent);
  });

  log.success(`${tabCount} onglets créés`);
}

async function createDrawerNavigation(features) {
  const hasCustomHeader = features.includes('customHeader');
  const hasUserProfile = features.includes('userProfile');
  const hasGroupedSections = features.includes('groupedSections');

  // Create (drawer) directory
  const drawerDir = path.join(APP_DIR, '(drawer)');
  if (!fs.existsSync(drawerDir)) {
    fs.mkdirSync(drawerDir, { recursive: true });
  }

  // Install drawer if not installed
  log.info('Vérification de expo-router/drawer...');
  try {
    execSync('pnpm list react-native-gesture-handler react-native-reanimated', { stdio: 'pipe' });
  } catch {
    log.info('Installation des dépendances drawer...');
    execSync('pnpm add react-native-gesture-handler react-native-reanimated', { stdio: 'inherit' });
  }

  // Create _layout.tsx for drawer
  const layoutContent = `import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/providers/ThemeProvider';
import { Home, Settings, User, Info } from 'lucide-react-native';
${hasUserProfile ? `import { View, Text, Image } from 'react-native';` : ''}

${hasUserProfile ? `function CustomDrawerContent(props: any) {
  const { theme } = useTheme();
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ 
        padding: 20, 
        backgroundColor: theme.colors.primary,
        paddingTop: 60,
      }}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>
          John Doe
        </Text>
        <Text style={{ color: '#fff', opacity: 0.8 }}>
          john.doe@example.com
        </Text>
      </View>
      {/* Add drawer items here */}
    </View>
  );
}
` : ''}

export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      ${hasUserProfile ? 'drawerContent={(props) => <CustomDrawerContent {...props} />}' : ''}
      screenOptions={{
        headerShown: ${hasCustomHeader},
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerStyle: {
          backgroundColor: theme.colors.card,
        },
        ${hasCustomHeader ? `headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,` : ''}
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Accueil',
          title: 'Accueil',
          drawerIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profil',
          title: 'Profil',
          drawerIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Paramètres',
          title: 'Paramètres',
          drawerIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: 'À propos',
          title: 'À propos',
          drawerIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
`;

  fs.writeFileSync(path.join(drawerDir, '_layout.tsx'), layoutContent);

  // Create drawer screens
  const screens = ['index', 'profile', 'settings', 'about'];
  const screenTitles = ['Accueil', 'Profil', 'Paramètres', 'À propos'];

  screens.forEach((screen, index) => {
    const screenContent = `import { Screen } from '@/components/ui';
import { View, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export default function ${screenTitles[index].replace(/\s/g, '')}Screen() {
  const { theme } = useTheme();

  return (
    <Screen
      ${!hasCustomHeader ? `header={{
        title: '${screenTitles[index]}',
      }}` : ''}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>
          ${screenTitles[index]}
        </Text>
      </View>
    </Screen>
  );
}
`;
    fs.writeFileSync(path.join(drawerDir, `${screen}.tsx`), screenContent);
  });

  log.success('Navigation drawer créée');
}

async function createStackNavigation() {
  // Create (stack) directory
  const stackDir = path.join(APP_DIR, '(stack)');
  if (!fs.existsSync(stackDir)) {
    fs.mkdirSync(stackDir, { recursive: true });
  }

  // Create _layout.tsx for stack
  const layoutContent = `import { Stack } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

export default function StackLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="details" 
        options={{
          headerShown: true,
          title: 'Détails',
        }}
      />
      <Stack.Screen 
        name="modal" 
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Modal',
        }}
      />
    </Stack>
  );
}
`;

  fs.writeFileSync(path.join(stackDir, '_layout.tsx'), layoutContent);

  // Create stack screens
  const indexContent = `import { Screen, Button } from '@/components/ui';
import { View, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Screen
      header={{
        title: 'Accueil',
      }}
    >
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 20 }}>
          Navigation Stack
        </Text>
        
        <Button onPress={() => router.push('/(stack)/details')}>
          Aller aux détails
        </Button>
        
        <Button variant="outline" onPress={() => router.push('/(stack)/modal')}>
          Ouvrir modal
        </Button>
      </View>
    </Screen>
  );
}
`;

  const detailsContent = `import { Screen, Button } from '@/components/ui';
import { View, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';

export default function DetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 20 }}>
          Page de détails
        </Text>
        
        <Button onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    </Screen>
  );
}
`;

  const modalContent = `import { Screen, Button } from '@/components/ui';
import { View, Text } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 20 }}>
          Écran Modal
        </Text>
        
        <Button onPress={() => router.back()}>
          Fermer
        </Button>
      </View>
    </Screen>
  );
}
`;

  fs.writeFileSync(path.join(stackDir, 'index.tsx'), indexContent);
  fs.writeFileSync(path.join(stackDir, 'details.tsx'), detailsContent);
  fs.writeFileSync(path.join(stackDir, 'modal.tsx'), modalContent);

  log.success('Navigation stack créée');
}

main().catch((error) => {
  log.error(`Erreur fatale: ${error.message}`);
  process.exit(1);
});
