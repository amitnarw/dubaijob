import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleContext';
import type { ProofToast } from '@/services/socialProofEngine';

function initials(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

/** Floating glass purchase-activity toast (localized). */
export function GlassToast({ toast }: { toast: ProofToast }) {
  const { t } = useLocale();
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(250)}
      style={styles.float}
      pointerEvents="none">
      <View style={styles.blur}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(toast.name)}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.line} numberOfLines={2}>
            <Text style={styles.name}>{t('toast_from', { name: toast.name, city: toast.city })} </Text>
            <Text style={styles.action}>{toast.action}</Text>
          </Text>
          <Text style={styles.time}>
            {toast.minutesAgo <= 1
              ? t('toast_just_now')
              : t('toast_min_ago', { n: toast.minutesAgo })}
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={20} color={Colors.gold} />
        <Ionicons name="chevron-forward" size={16} color={Colors.faint} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  float: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 108,
    borderRadius: Radii.card,
    overflow: 'hidden',
    backgroundColor: '#141417',
  },
  blur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.trackBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Type.chapterTitle,
    fontSize: 16,
    color: Colors.goldLight,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  line: {
    ...Type.small,
    color: Colors.text,
  },
  name: {
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  action: {
    ...Type.small,
    color: Colors.muted,
  },
  time: {
    ...Type.caption,
    color: Colors.faint,
  },
});