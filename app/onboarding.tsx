import { Button } from '@/components/ui';
import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';
import { ChevronRight, Shield, Sparkles, Zap } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function Onboarding() {
  const { theme, utils } = useTheme();
  const { completeOnboarding } = useOnboarding();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Bienvenue sur Jurici',
      description: 'Découvrez une nouvelle façon de gérer vos projets avec simplicité et efficacité.',
      icon: <Sparkles size={80} color={theme.colors.primary} />,
      color: theme.colors.primary,
    },
    {
      id: '2',
      title: 'Sécurité maximale',
      description: 'Vos données sont protégées avec les dernières technologies de sécurité.',
      icon: <Shield size={80} color={theme.colors.secondary} />,
      color: theme.colors.secondary,
    },
    {
      id: '3',
      title: 'Performance optimale',
      description: 'Interface rapide et fluide pour une expérience utilisateur exceptionnelle.',
      icon: <Zap size={80} color={theme.colors.success} />,
      color: theme.colors.success,
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/(auth)/sign-in' as any);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: theme.colors.background }]}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={[utils.flex1, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentIndex === index ? theme.colors.primary : theme.colors.border,
                width: currentIndex === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <Pressable onPress={handleFinish}>
              <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
                Passer
              </Text>
            </Pressable>
            <Button
              title="Suivant"
              onPress={handleNext}
              variant="primary"
              size="lg"
              icon={<ChevronRight size={20} color="#FFFFFF" />}
            />
          </>
        ) : (
          <Button
            title="Commencer"
            onPress={handleFinish}
            variant="primary"
            size="lg"
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.lg,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: borderRadius.full,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  skipText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
});
