import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors, Radii, Spacing, Type } from '@/constants/theme';
import { Springs, AnimatedPressableScale } from '@/constants/animations';
import { usePurchases } from '@/context/PurchaseContext';
import { ToastControl } from '@/services/toastControl';

export interface PaymentItem {
  id?: string;
  name: string;
  price: number;
  currency?: string;
  productId?: string;
  description?: string;
}

interface PaymentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  item: PaymentItem | null;
  onSuccess?: () => void;
}

export function PaymentBottomSheet({
  visible,
  onClose,
  item,
  onSuccess,
}: PaymentBottomSheetProps) {
  const { buy, storefront } = usePurchases();
  const [selectedMethod, setSelectedMethod] = useState<'balance' | 'card'>('balance');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible || !item) return null;

  const currencySymbol = item.currency || '$';
  const displayPrice = `${currencySymbol}${item.price}`;

  const handleBuy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setBusy(true);
    setError(null);
    ToastControl.paused = true;

    try {
      if (item.productId && storefront.available) {
        await buy(item.productId);
      } else {
        // Fallback demo purchase delay
        await new Promise((r) => setTimeout(r, 900));
      }
      ToastControl.paused = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setBusy(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      ToastControl.paused = false;
      setError(err?.message || 'Payment could not be completed.');
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(180)}
          style={styles.backdrop}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <Animated.View
          entering={SlideInDown.springify().damping(22).stiffness(240)}
          exiting={SlideOutDown.duration(220)}
          style={styles.sheet}
        >
          {/* Overlapping circular sticker badge (Exact Reference: screenshot_200929.png) */}
          <View style={styles.stickerBadgeWrapper}>
            <View style={styles.stickerBadge}>
              <View style={styles.stickerIconBg}>
                <Ionicons name="document-text" size={32} color="#D96A38" />
                <View style={styles.pencilAccent}>
                  <Ionicons name="pencil" size={14} color="#7BC96F" />
                </View>
              </View>
            </View>
          </View>

          {/* Close button */}
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={20} color={Colors.muted} />
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Are you sure about buying this course?</Text>
          <Text style={styles.itemSubtitle}>{item.name}</Text>

          {/* Payment Method Section */}
          <Text style={styles.sectionHeader}>Payment method</Text>
          <AnimatedPressableScale
            onPress={() => setSelectedMethod('balance')}
            style={[
              styles.methodCard,
              selectedMethod === 'balance' && styles.methodCardActive,
            ]}
          >
            <View style={styles.methodLeft}>
              {/* Radio dot */}
              <View style={styles.radioOuter}>
                {selectedMethod === 'balance' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.walletIconWrap}>
                <Ionicons name="wallet-outline" size={19} color="#FFFFFF" />
              </View>
              <Text style={styles.methodLabel}>Total balance</Text>
            </View>
            <Text style={styles.methodValue}>$200</Text>
          </AnimatedPressableScale>

          {/* Payment Details Section */}
          <Text style={styles.sectionHeader}>Payment details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subtotal</Text>
              <Text style={styles.detailValue}>{displayPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipping</Text>
              <Text style={styles.detailValue}>$0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{displayPrice}</Text>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Buy Now Green CTA */}
          <AnimatedPressableScale
            onPress={handleBuy}
            disabled={busy}
            style={[styles.buyBtn, busy && { opacity: 0.8 }]}
          >
            {busy ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <Text style={styles.buyBtnText}>Buy Now</Text>
            )}
          </AnimatedPressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 56, // extra space for the overlapping sticker badge
    paddingBottom: 38,
    position: 'relative',
  },
  stickerBadgeWrapper: {
    position: 'absolute',
    top: -46,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  stickerBadge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#F8A88E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  stickerIconBg: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFE9D6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pencilAccent: {
    position: 'absolute',
    top: 4,
    right: 4,
    transform: [{ rotate: '45deg' }],
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 21,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 12,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#C4C4C4',
    marginBottom: 8,
    marginTop: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  methodCardActive: {
    borderColor: '#E89E84',
    backgroundColor: '#262322',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E89E84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E89E84',
  },
  walletIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#353535',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  methodValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#262626',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#A0A0A0',
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#383838',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 12,
  },
  buyBtn: {
    backgroundColor: '#7BC96F',
    borderRadius: Radii.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#121212',
  },
});
