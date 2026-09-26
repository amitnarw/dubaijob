import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors, Type, Radii, Shadows, Spacing } from '@/constants/theme';
import { GoldButton } from './GoldButton';
import { ToastControl } from '@/services/toastControl';
import { useLocale } from '@/i18n/LocaleContext';
import {
  ensureOfferDeadline,
  formatCountdown,
  getOfferDeadlineMs,
  hasUsedExtension,
  markExtensionUsed,
} from '@/services/discountService';
import { DISCOUNT_PRICE_INR, DISCOUNT_SEATS_LEFT, FULL_PRICE_INR } from '@/data/offers';

interface Props {
  visible: boolean;
  onClose: () => void;
  onClaim: () => void;
}

function useCountdown(active: boolean): number {
  const [ms, setMs] = useState<number>(0);
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setInterval>;
    let cancelled = false;
    (async () => {
      await ensureOfferDeadline();
      const tick = async () => {
        const left = (await getOfferDeadlineMs()) ?? 0;
        if (cancelled) return;
        setMs(left);
        if (left <= 0) {
          const used = await hasUsedExtension();
          if (!used) {
            await markExtensionUsed();
            await ensureOfferDeadline();
          } else {
            clearInterval(timer);
          }
        }
      };
      await tick();
      timer = setInterval(tick, 1000);
    })();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active]);
  return ms;
}

export function DiscountModal({ visible, onClose, onClaim }: Props) {
  const ms = useCountdown(visible);
  const { t } = useLocale();
  const discount = DISCOUNT_PRICE_INR;

  useEffect(() => {
    if (visible) ToastControl.paused = true;
    else if (!visible) ToastControl.paused = false;
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View entering={ZoomIn.duration(280)} style={[styles.card, Shadows.modal]}>
          <LinearGradient
            colors={['#3A2C10', '#171207']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.glow}
          />
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={16} color={Colors.gold} />
            <Text style={styles.timer}>{formatCountdown(ms)}</Text>
          </View>
          <Text style={styles.kicker}>{t('discount_kicker')}</Text>
          <Text style={styles.title}>{t('discount_title')}</Text>
          <View style={styles.priceRow}>
            {discount !== null && (
              <Text style={styles.strike}>₹{FULL_PRICE_INR.toLocaleString('en-IN')}</Text>
            )}
            <Text style={styles.price}>₹{(discount ?? FULL_PRICE_INR).toLocaleString('en-IN')}</Text>
          </View>
          <Text style={styles.seats}>{t('discount_seats', { n: DISCOUNT_SEATS_LEFT })}</Text>
          <GoldButton title={t('discount_cta')} onPress={onClaim} style={styles.cta} />
          <Pressable onPress={onClose} hitSlop={12} style={styles.dismiss}>
            <Text style={styles.dismissText}>{t('discount_dismiss')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    padding: Spacing.xl + 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.goldTint,
    borderRadius: Radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: Spacing.md,
  },
  timer: {
    ...Type.bodyMedium,
    fontFamily: 'Inter-Bold',
    color: Colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  kicker: {
    ...Type.caption,
    fontFamily: 'Inter-Bold',
    color: Colors.gold,
    letterSpacing: 2,
  },
  title: {
    ...Type.chapterTitle,
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: Spacing.md,
  },
  strike: {
    ...Type.chapterTitle,
    fontSize: 20,
    color: Colors.faint,
    textDecorationLine: 'line-through',
  },
  price: {
    ...Type.price,
    fontSize: 38,
    color: Colors.goldLight,
  },
  seats: {
    ...Type.small,
    color: Colors.muted,
    marginTop: 6,
  },
  cta: {
    width: '100%',
    marginTop: Spacing.xl,
  },
  dismiss: {
    marginTop: 14,
  },
  dismissText: {
    ...Type.small,
    color: Colors.faint,
  },
});