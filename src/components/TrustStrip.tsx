import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type } from '@/constants/theme';
import { STATS } from '@/data/offers';
import { useLocale } from '@/i18n/LocaleContext';

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k+` : `${n}`;
}

/** One-line trust strip: students · rating · years. */
export function TrustStrip() {
  const { t } = useLocale();
  return (
    <View style={styles.row}>
      <Ionicons name="people" size={14} color={Colors.gold} />
      <Text style={styles.text}>
        {fmt(STATS.students)} {t('proof_students')} · {STATS.rating}★ · {STATS.years}+ {t('proof_years')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    ...Type.small,
    color: Colors.muted,
  },
});