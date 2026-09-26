import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';

import { Colors, Radii, Spacing, Type } from '@/constants/theme';
import { Springs, Transitions, AnimatedPressableScale } from '@/constants/animations';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/i18n/LocaleContext';

// 5 images for the curved bottom arc gallery (Exact Reference: screenshot_201217.png)
const ARC_CARDS = [
  {
    id: '1',
    rotation: '-14deg',
    translateY: 18,
    icon: 'laptop-outline',
    color: '#D2EBE0',
    label: 'Tech',
  },
  {
    id: '2',
    rotation: '-7deg',
    translateY: 6,
    icon: 'construct-outline',
    color: '#DFDBF5',
    label: 'Engineering',
  },
  {
    id: '3',
    rotation: '0deg',
    translateY: 0,
    icon: 'briefcase-outline',
    color: '#FBE3D3',
    label: 'Corporate',
  },
  {
    id: '4',
    rotation: '7deg',
    translateY: 6,
    icon: 'business-outline',
    color: '#D6EDF8',
    label: 'Consulting',
  },
  {
    id: '5',
    rotation: '14deg',
    translateY: 18,
    icon: 'airplane-outline',
    color: '#FDF1BA',
    label: 'Aviation',
  },
];

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setBusy(true);
    setError(null);
    try {
      const res = await signIn();
      if (res.status === 'signed-out') {
        setError('Sign in was cancelled.');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not sign in with Google.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 24) }]}>
      {/* Top Content Area */}
      <View style={styles.topContainer}>
        {/* Brand Chip */}
        <Animated.View entering={Transitions.fadeDown(0)} style={styles.brandChip}>
          <Ionicons name="sparkles" size={14} color="#D96A38" />
          <Text style={styles.brandChipText}>DUBAI MASTERCLASS PLATFORM</Text>
        </Animated.View>

        {/* Title (Exact Reference: screenshot_201217.png) */}
        <Animated.View entering={Transitions.fadeDown(60)}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.titleSub}>to DubaiJob</Text>
        </Animated.View>

        <Animated.Text entering={Transitions.fadeDown(120)} style={styles.desc}>
          Sign in to access your curated Dubai job roadmap, verified ATS resume blueprints, and recruiter network.
        </Animated.Text>

        {/* Google Sign In Button */}
        <Animated.View entering={Transitions.fadeDown(180)} style={styles.buttonContainer}>
          <AnimatedPressableScale
            onPress={handleGoogleSignIn}
            disabled={busy}
            style={[styles.googleBtn, busy && { opacity: 0.8 }]}
          >
            {busy ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <View style={styles.googleBtnContent}>
                {/* Stylized Google Icon */}
                <View style={styles.googleIconBadge}>
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                </View>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </View>
            )}
          </AnimatedPressableScale>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.trustBadgeRow}>
            <Ionicons name="shield-checkmark" size={14} color="#7BC96F" />
            <Text style={styles.trustBadgeText}>
              Secure 1-tap OAuth • No registration required
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Curved Arc Gallery (Exact Reference: screenshot_201217.png) */}
      <Animated.View
        entering={Transitions.fadeUp(240)}
        style={[styles.arcGalleryContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}
      >
        <Text style={styles.arcGalleryTitle}>Explore UAE Industries</Text>
        <View style={styles.arcRow}>
          {ARC_CARDS.map((card) => (
            <View
              key={card.id}
              style={[
                styles.arcCard,
                {
                  backgroundColor: card.color,
                  transform: [
                    { rotate: card.rotation },
                    { translateY: card.translateY },
                  ],
                },
              ]}
            >
              <View style={styles.arcIconWrap}>
                <Ionicons name={card.icon as any} size={22} color="#1A1A1A" />
              </View>
              <Text style={styles.arcCardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF7F2', // Warm elegant light tone matching screenshot_201217.png
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingHorizontal: 28,
    paddingTop: 36,
    alignItems: 'center',
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBE3D3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    marginBottom: 20,
  },
  brandChipText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#D96A38',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  titleSub: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 14,
  },
  desc: {
    fontSize: 14.5,
    fontFamily: 'Inter-Regular',
    color: '#6B6862',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  googleBtn: {
    width: '100%',
    height: 56,
    borderRadius: Radii.pill,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15.5,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginTop: 10,
    textAlign: 'center',
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  trustBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7A7670',
  },
  arcGalleryContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 10,
  },
  arcGalleryTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#9C988F',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  arcRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    height: 140,
    paddingHorizontal: 10,
  },
  arcCard: {
    width: 64,
    height: 100,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  arcIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  arcCardLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
});