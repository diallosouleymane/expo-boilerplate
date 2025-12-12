import { AlertModal, Button, Card, Input, PermissionCard } from '@/components/ui';
import { fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import { Bell, Camera, Lock, LogOut, Mail, MapPin, Moon, Smartphone, Sun, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Demo() {
  const { theme, utils, themeMode, setThemeMode } = useTheme();
  const { session, signOut } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showDestructiveAlert, setShowDestructiveAlert] = useState(false);
  const [showNotificationPermission, setShowNotificationPermission] = useState(false);
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={[utils.flex1, utils.pMd, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Démo des composants 🎨
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {session?.user.name || session?.user.email}
          </Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Thème
          </Text>
          <View style={styles.themeButtons}>
            <Pressable
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeMode === 'light'
                      ? theme.colors.primary
                      : theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setThemeMode('light')}
            >
              <Sun
                size={20}
                color={themeMode === 'light' ? '#fff' : theme.colors.text}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      themeMode === 'light' ? '#fff' : theme.colors.text,
                  },
                ]}
              >
                Clair
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeMode === 'dark'
                      ? theme.colors.primary
                      : theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <Moon
                size={20}
                color={themeMode === 'dark' ? '#fff' : theme.colors.text}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      themeMode === 'dark' ? '#fff' : theme.colors.text,
                  },
                ]}
              >
                Sombre
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeMode === 'system'
                      ? theme.colors.primary
                      : theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setThemeMode('system')}
            >
              <Smartphone
                size={20}
                color={themeMode === 'system' ? '#fff' : theme.colors.text}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      themeMode === 'system' ? '#fff' : theme.colors.text,
                  },
                ]}
              >
                Système
              </Text>
            </Pressable>
          </View>
        </Card>

        {/* Buttons Demo - Variants */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Boutons - Variantes
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Primary"
              variant="primary"
              onPress={() => toast.info('Bouton Primary cliqué')}
              fullWidth
            />
            <Button
              title="Secondary"
              variant="secondary"
              onPress={() => toast.info('Bouton Secondary cliqué')}
              fullWidth
            />
            <Button
              title="Outline"
              variant="outline"
              onPress={() => toast.info('Bouton Outline cliqué')}
              fullWidth
            />
            <Button
              title="Ghost"
              variant="ghost"
              onPress={() => toast.info('Bouton Ghost cliqué')}
              fullWidth
            />
          </View>
        </Card>

        {/* Buttons Demo - Sizes */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Boutons - Tailles
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Small"
              size="sm"
              onPress={() => toast.info('Taille Small')}
              fullWidth
            />
            <Button
              title="Medium"
              size="md"
              onPress={() => toast.info('Taille Medium')}
              fullWidth
            />
            <Button
              title="Large"
              size="lg"
              onPress={() => toast.info('Taille Large')}
              fullWidth
            />
          </View>
        </Card>

        {/* Inputs Demo */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Inputs
          </Text>
          <View style={styles.inputGroup}>
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={20} color={theme.colors.textSecondary} />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
              secureTextEntry
            />
            <Input
              label="Input avec erreur"
              placeholder="Champ invalide"
              value={username}
              onChangeText={setUsername}
              error="Ce champ est requis"
              leftIcon={<User size={20} color={theme.colors.error} />}
            />
          </View>
        </Card>

        {/* Toasts Demo */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Toasts (swipez ↑ ← → pour fermer)
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Success Toast"
              variant="outline"
              onPress={() => toast.success('Opération réussie ! 🎉')}
              fullWidth
            />
            <Button
              title="Error Toast"
              variant="outline"
              onPress={() => toast.error('Une erreur s\'est produite ❌')}
              fullWidth
            />
            <Button
              title="Warning Toast"
              variant="outline"
              onPress={() => toast.warning('Attention ! ⚠️')}
              fullWidth
            />
            <Button
              title="Info Toast"
              variant="outline"
              onPress={() => toast.info('Information importante ℹ️')}
              fullWidth
            />
          </View>
        </Card>

        {/* Cards Demo */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Cards - Shadows
          </Text>
          <View style={styles.cardGroup}>
            <Card shadow="sm">
              <Text style={[styles.cardContent, { color: theme.colors.text }]}>
                Shadow Small
              </Text>
            </Card>
            <Card shadow="md">
              <Text style={[styles.cardContent, { color: theme.colors.text }]}>
                Shadow Medium
              </Text>
            </Card>
            <Card shadow="lg">
              <Text style={[styles.cardContent, { color: theme.colors.text }]}>
                Shadow Large
              </Text>
            </Card>
            <Card
              shadow="none"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text style={[styles.cardContent, { color: theme.colors.text }]}>
                No Shadow
              </Text>
            </Card>
          </View>
        </Card>

        {/* Alert Modals Demo */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Alert Modals
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Alert Simple"
              variant="outline"
              onPress={() => setShowAlert(true)}
              fullWidth
            />
            <Button
              title="Alert Confirmation"
              variant="outline"
              onPress={() => setShowConfirmAlert(true)}
              fullWidth
            />
            <Button
              title="Alert Destructive"
              variant="outline"
              onPress={() => setShowDestructiveAlert(true)}
              fullWidth
            />
          </View>
        </Card>

        {/* Permission Cards Demo */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Permission Cards
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Notification Permission"
              variant="outline"
              onPress={() => setShowNotificationPermission(true)}
              fullWidth
            />
            <Button
              title="Camera Permission"
              variant="outline"
              onPress={() => setShowCameraPermission(true)}
              fullWidth
            />
            <Button
              title="Location Permission"
              variant="outline"
              onPress={() => setShowLocationPermission(true)}
              fullWidth
            />
          </View>
        </Card>

        {/* Sign Out Button */}
        <Button
          title="Se déconnecter"
          onPress={signOut}
          variant="outline"
          size="lg"
          fullWidth
          icon={<LogOut size={20} color={theme.colors.primary} />}
        />

        {/* Alert Modals */}
        <AlertModal
          visible={showAlert}
          title="Information"
          message="Ceci est un exemple d'alerte simple avec un seul bouton."
          buttons={[
            {
              text: 'OK',
              style: 'default',
            },
          ]}
          onDismiss={() => setShowAlert(false)}
        />

        <AlertModal
          visible={showConfirmAlert}
          title="Confirmation"
          message="Êtes-vous sûr de vouloir continuer cette action ?"
          buttons={[
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Confirmer',
              style: 'default',
              onPress: () => toast.success('Action confirmée !'),
            },
          ]}
          onDismiss={() => setShowConfirmAlert(false)}
        />

        <AlertModal
          visible={showDestructiveAlert}
          title="Supprimer"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
          buttons={[
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => toast.error('Élément supprimé'),
            },
          ]}
          onDismiss={() => setShowDestructiveAlert(false)}
        />

        {/* Permission Cards */}
        <PermissionCard
          visible={showNotificationPermission}
          type="notifications"
          title="Activer les notifications"
          message="Pour recevoir des notifications importantes, veuillez activer les notifications dans les paramètres."
          icon={<Bell size={60} color="#FFFFFF" />}
          onDismiss={() => setShowNotificationPermission(false)}
          onLater={() => toast.info('Notifications désactivées')}
        />

        <PermissionCard
          visible={showCameraPermission}
          type="camera"
          title="Accès à la caméra"
          message="L'application a besoin d'accéder à votre caméra pour prendre des photos."
          icon={<Camera size={60} color="#FFFFFF" />}
          onDismiss={() => setShowCameraPermission(false)}
          onLater={() => toast.info('Caméra désactivée')}
        />

        <PermissionCard
          visible={showLocationPermission}
          type="location"
          title="Accès à la localisation"
          message="Autorisez l'accès à votre position pour trouver des services à proximité."
          icon={<MapPin size={60} color="#FFFFFF" />}
          onDismiss={() => setShowLocationPermission(false)}
          onLater={() => toast.info('Localisation désactivée')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
  },
  card: {
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cardContent: {
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  themeButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  inputGroup: {
    gap: spacing.md,
  },
  cardGroup: {
    gap: spacing.md,
  },
});
