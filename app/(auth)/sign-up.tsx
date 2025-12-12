import { Button, Card, Input } from '@/components/ui';
import { fontSize, spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import { Link, router } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SignUp() {
  const { theme, utils } = useTheme();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = 'Le nom est requis';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/(demo)',
      });

      if (error) {
        toast.error(error.message || "Échec de l'inscription");
      } else if (data) {
        toast.success('Inscription réussie ! Bienvenue 🎉');
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
        <View style={[utils.flex1, utils.center, utils.pxMd, utils.pyLg]}>
          <Card style={styles.card}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
              ]}
            >
              Inscription
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Créez votre compte
            </Text>

            <View style={styles.form}>
              <Input
                label="Nom complet"
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors({ ...errors, name: undefined });
                }}
                autoComplete="name"
                error={errors.name}
                leftIcon={<User size={20} color={theme.colors.textTertiary} />}
              />

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
                autoComplete="password-new"
                error={errors.password}
                leftIcon={<Lock size={20} color={theme.colors.textTertiary} />}
              />

              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry
                autoComplete="password-new"
                error={errors.confirmPassword}
                leftIcon={<Lock size={20} color={theme.colors.textTertiary} />}
              />

              <Button
                title="S'inscrire"
                onPress={handleSignUp}
                loading={loading}
                fullWidth
                variant="primary"
                size="lg"
              />

              <View style={styles.footer}>
                <Text style={{ color: theme.colors.textSecondary }}>
                  Déjà un compte ?{' '}
                </Text>
                <Link href={'/(auth)/sign-in' as any} asChild>
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                    Se connecter
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
