import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Colors, Type, Spacing } from '@/constants/theme';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES } from '@/data/packages';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { noteTabFocus } from '@/services/tabFocus';
import { PaymentBottomSheet, PaymentItem } from '@/components/PaymentBottomSheet';

import Animated from 'react-native-reanimated';
import { Transitions } from '@/constants/animations';

export default function PackagesTab() {
  const { entitlements } = usePurchases();
  const { t } = useLocale();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      noteTabFocus('packages');
    }, []),
  );

  const handleBuyPackage = (pkg: typeof PACKAGES[0]) => {
    setSelectedItem({
      name: pkg.name,
      price: pkg.priceInr,
      currency: '₹',
      productId: pkg.productId,
      description: pkg.tagline,
    });
    setSheetVisible(true);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={Transitions.fadeDown(0)}>
          <Text style={styles.hero}>{t('packages_hero')}</Text>
          <Text style={styles.sub}>{t('packages_sub')}</Text>
        </Animated.View>
        {PACKAGES.map((p, index) => (
          <Animated.View key={p.productId} entering={Transitions.fadeDown(index * 90)}>
            <PackageCard
              pkg={p}
              owned={!!entitlements.packages[p.productId]}
              onBuy={() => handleBuyPackage(p)}
            />
          </Animated.View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Payment Bottom Sheet (Exact Reference: screenshot_200929.png) */}
      <PaymentBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        item={selectedItem}
      />
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