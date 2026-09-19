import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Type, Presets, Radii, Spacing } from '@/constants/theme';
import { GoldButton } from '@/components/GoldButton';
import { usePurchases } from '@/context/PurchaseContext';
import { useLocale } from '@/i18n/LocaleContext';
import { PRODUCT_COURSE_DISCOUNT, PRODUCT_COURSE_FULL, STATS } from '@/data/offers';
import { PACKAGES } from '@/data/packages';
import { ToastControl } from '@/services/toastControl';

export default function CheckoutScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { storefront, buy, lastEvent } = usePurchases();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const item = useMemo(() => {
    if (productId === PRODUCT_COURSE_FULL || productId === PRODUCT_COURSE_DISCOUNT) {
      return {
        name: 'Dubai Job Master Course',
        bullets: [
          'All 25 video lessons, lifetime access',
          'Dubai CV templates + portal guides',
          'Free updates forever',
        ],
        fallbackPrice: 6000,
      };
    }
    const pkg = PACKAGES.find((p) => p.productId === productId);
    if (!pkg) return null;
    return { name: pkg.name, bullets: pkg.bullets, fallbackPrice: pkg.priceInr };
  }, [productId]);

  const storeProduct = productId ? storefront.bySku[productId] : undefined;
  const priceText =
    storeProduct?.displayPrice ?? (item ? `₹${item.fallbackPrice.toLocaleString('en-IN')}` : '');

  const pay = async () => {
    if (!productId) return;
    if (!storefront.available || !storeProduct) {
      setError(t('checkout_unavailable'));
      return;
    }
    setBusy(true);
    setError(null);
    ToastControl.paused = true;
    try {
      await buy(productId);
    } catch (e) {
      ToastControl.paused = false;
      setError(e instanceof Error ? e.message : 'Purchase could not start.');
      setBusy(false);
    }
  };

  if (!item) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>{t('checkout_not_found')}</Text>
        <GoldButton title={t('checkout_back')} onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.kicker}>{t('checkout_title').toUpperCase()}</Text>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.card}>
          {item.bullets.map((b) => (
            <View key={b} style={styles.row}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.gold} />
              <Text style={styles.bullet}>{b}</Text>
            </View>
          ))}
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.price}>{priceText}</Text>
          <Text style={styles.rating}>
            {STATS.rating}★ · {(STATS.reviewCount / 1000).toFixed(1)}k {t('proof_reviews_suffix')}
          </Text>
        </View>
        {lastEvent === 'pending' && (
          <View style={styles.pending}>
            <ActivityIndicator color={Colors.gold} />
            <Text style={styles.pendingText}>{t('checkout_pending')}</Text>
          </View>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
        {!storefront.available && <Text style={styles.note}>{t('checkout_unavailable')}</Text>}
        <GoldButton
          title={busy ? t('checkout_waiting') : t('checkout_pay', { price: priceText })}
          onPress={pay}
          disabled={busy}
          style={styles.cta}
        />
        <Text style={styles.secure}>{t('checkout_secured')}</Text>
      </ScrollView>
      <GrantedRedirect busy={busy} onDone={() => { ToastControl.paused = false; setBusy(false); }} />
    </View>
  );
}

/** Watches the purchase listener outcome and routes to success. */
function GrantedRedirect({ busy, onDone }: { busy: boolean; onDone: () => void }) {
  const { lastEvent } = usePurchases();
  useEffect(() => {
    if (busy && lastEvent === 'granted') {
      onDone();
      router.replace('/success');
    }
  }, [busy, lastEvent, onDone]);
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scroll: {
    padding: Spacing.screen,
    paddingTop: 52,
    gap: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.gold,
    letterSpacing: 2,
  },
  title: {
    ...Type.heroSerifless,
    fontSize: 30,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    gap: 10,
  },
  row: {
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
  priceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  price: {
    ...Type.price,
    color: Colors.goldLight,
  },
  rating: {
    ...Type.small,
    color: Colors.muted,
  },
  pending: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: Colors.goldTint,
    borderRadius: Radii.card,
    padding: 14,
  },
  pendingText: {
    ...Type.small,
    color: Colors.goldLight,
    flex: 1,
  },
  error: {
    ...Type.small,
    color: Colors.danger,
    textAlign: 'center',
  },
  note: {
    ...Type.caption,
    color: Colors.faint,
    textAlign: 'center',
  },
  cta: {
    marginTop: 4,
  },
  secure: {
    ...Type.caption,
    color: Colors.faint,
    textAlign: 'center',
  },
});