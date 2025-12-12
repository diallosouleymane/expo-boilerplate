import { Button, Card, Input } from '@/components/ui';
import { fontSize, spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import { Link, router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SignIn() {
  const { theme, utils } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/(demo)',
      });

      if (error) {
        toast.error(error.message || 'Échec de la connexion');
      } else if (data) {
        toast.success('Connexion réussie !');
        router.replace('/(demo)' as any);
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[utils.flex1, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[utils.flex1, utils.center, utils.pxMd]}>
          <Card style={styles.card}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
              ]}
            >
              Connexion
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Connectez-vous à votre compte
            </Text>

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                leftIcon={<Mail size={20} color={theme.colors.textTertiary} />}
              />

              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry
                autoComplete="password"
                error={errors.password}
                leftIcon={<Lock size={20} color={theme.colors.textTertiary} />}
              />

              <Button
                title="Se connecter"
                onPress={handleSignIn}
                loading={loading}
                fullWidth
                variant="primary"
                size="lg"
              />

              <View style={styles.footer}>
                <Text style={{ color: theme.colors.textSecondary }}>
                  Pas encore de compte ?{' '}
                </Text>
                <Link href={'/(auth)/sign-up' as any} asChild>
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                    S'inscrire
                  </Text>
                </Link>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
});
