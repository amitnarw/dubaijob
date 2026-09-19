import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Radii, Spacing } from '@/constants/theme';
import { GoldButton } from './GoldButton';
import type { CoursePackage } from '@/data/packages';
import { useLocale } from '@/i18n/LocaleContext';

interface Props {
  pkg: CoursePackage;
  owned: boolean;
  onBuy: () => void;
}

export function PackageCard({ pkg, owned, onBuy }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLocale();
  const shown = expanded ? pkg.bullets : pkg.bullets.slice(0, 2);

  return (
    <View style={styles.card}>
      {pkg.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pkg.badge}</Text>
        </View>
      )}
      <Text style={styles.name}>{pkg.name}</Text>
      <Text style={styles.tagline}>{pkg.tagline}</Text>
      <View style={styles.bullets}>
        {shown.map((b) => (
          <View key={b} style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.gold} />
            <Text style={styles.bullet}>{b}</Text>
          </View>
        ))}
      </View>
      {pkg.bullets.length > 2 && (
        <Pressable onPress={() => setExpanded((e) => !e)} hitSlop={8} style={styles.moreBtn}>
          <Text style={styles.moreText}>
            {expanded ? t('podcast_show_less') : t('packages_more_included', { n: pkg.bullets.length - 2 })}
          </Text>
        </Pressable>
      )}
      <View style={styles.footer}>
        <Text style={styles.price}>₹{pkg.priceInr.toLocaleString('en-IN')}</Text>
        {owned ? (
          <View style={styles.owned}>
            <Ionicons name="checkmark" size={14} color={Colors.textOn} />
            <Text style={styles.ownedText}>{t('account_owned')}</Text>
          </View>
        ) : (
          <GoldButton title={t('packages_get')} onPress={onBuy} style={styles.btn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: 18,
    marginBottom: Spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.textOn,
    letterSpacing: 1,
  },
  name: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.text,
  },
  tagline: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 2,
  },
  bullets: {
    gap: Spacing.sm,
    marginTop: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    ...Type.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  moreBtn: {
    marginTop: Spacing.sm,
  },
  moreText: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  price: {
    ...Type.price,
    color: Colors.goldLight,
  },
  btn: {
    flex: 1,
    maxWidth: 170,
  },
  owned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  ownedText: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.textOn,
  },
});