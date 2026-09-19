import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { BounceIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Type, Spacing } from '@/constants/theme';
import { GoldButton } from '@/components/GoldButton';
import { useLocale } from '@/i18n/LocaleContext';

/** Celebratory purchase confirmation (Peak-End peak). */
export default function SuccessScreen() {
  const { t } = useLocale();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  return (
    <View style={styles.root}>
      <Animated.View entering={BounceIn.duration(600)} style={styles.badge}>
        <Ionicons name="checkmark" size={44} color={Colors.textOn} />
      </Animated.View>
      <Text style={styles.title}>{t('success_title')}</Text>
      <Text style={styles.sub}>{t('success_sub')}</Text>
      <GoldButton title={t('success_cta')} onPress={() => router.replace('/(tabs)')} style={styles.cta} />
      <GoldButton title={t('success_next')} dark onPress={() => router.replace('/(tabs)/proof')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screen,
    gap: Spacing.md,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Type.heroSerifless,
    fontSize: 38,
    color: Colors.text,
  },
  sub: {
    ...Type.body,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  cta: {
    width: '100%',
    marginTop: Spacing.md,
  },
});