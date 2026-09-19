import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Colors, Type, Spacing } from '@/constants/theme';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES } from '@/data/packages';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { noteTabFocus } from '@/services/tabFocus';

export default function PackagesTab() {
  const { entitlements } = usePurchases();
  const { t } = useLocale();

  useFocusEffect(
    useCallback(() => {
      noteTabFocus('packages');
    }, []),
  );

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.hero}>{t('packages_hero')}</Text>
        <Text style={styles.sub}>{t('packages_sub')}</Text>
        {PACKAGES.map((p) => (
          <PackageCard
            key={p.productId}
            pkg={p}
            owned={!!entitlements.packages[p.productId]}
            onBuy={() =>
              router.push({ pathname: '/checkout/[productId]', params: { productId: p.productId } })
            }
          />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    padding: Spacing.screen,
    paddingTop: 56,
  },
  hero: {
    ...Type.heroSerifless,
    color: Colors.text,
  },
  sub: {
    ...Type.body,
    color: Colors.muted,
    marginTop: 6,
    marginBottom: Spacing.xl,
  },
});